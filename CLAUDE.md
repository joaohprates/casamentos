# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Wedding gift registry website for Allan'De (8 Nov, Maringá). Guests can view event info, contribute to gifts via Pix payments, and confirm attendance (RSVP) with an invite token.

## Tech Stack

- **Frontend:** React 19 + TypeScript, Vite 8, MUI 7, Emotion (CSS-in-JS)
- **Backend:** Express 5 (local dev) / Vercel serverless functions (production)
- **Payments:** Mercado Pago Orders API (Pix/bank transfer)
- **RSVP data:** Google Sheets API via service account
- **Deployment:** Vercel

## Commands

- `npm run dev` — Start Vite dev server (frontend only, proxies `/api/*` to port 3001)
- `npm run server` — Start Express backend on port 3001
- `npm run build` — Type-check with `tsc -b` then build with Vite
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

Both `dev` and `server` must run simultaneously for local development.

## Architecture

### Frontend (`src/`)
- `components/Layout.tsx` — Main layout: video background (loaded from Cloudinary), three toggle buttons (Info / Presentes / Confirmar Presença). Reads `?token=` from URL on mount to auto-open RSVP tab.
- `components/GiftsSection.tsx` — Gift grid with predefined items, Pix payment dialog (QR code display, BR code copy)
- `components/InfoSection.tsx` — Event details with Google Maps embed
- `components/RSVPSection.tsx` — Invite token validation + RSVP form. Token is validated on blur/button click via `GET /api/validate-token`. On success shows family name and adult count, then collects name/email/crianças and submits to `POST /api/rsvp`. Post-submission shows Google Calendar link.
- `components/Hero.tsx` — Unused stub component
- `palette.ts` — Color theme constants and glassmorphism styles

### Backend (dual setup)
- `server.js` — Express server for local dev (port 3001)
- `api/pix.js`, `api/rsvp.js`, `api/validate-token.js` — Vercel serverless functions (same logic as server.js routes)
- `googleSheets.js` — Shared Google Sheets helper used by both server.js and Vercel functions

### API Routes
- `POST /api/pix` — Creates Mercado Pago order, returns `{data: {brCode, brCodeBase64}}`
- `GET /api/validate-token?token=` — Returns `{familia, adultos}` or 409 if already used
- `POST /api/rsvp` — Validates token, appends row to Google Sheet, marks token as used

### Google Sheets Structure
Two tabs in the same spreadsheet:
- **Convites tab** (default: `"Convites"`) — Columns: Token | Familia | Adultos | Confirmado (timestamp when used)
- **Confirmações tab** (first sheet, or `GOOGLE_SHEET_TAB_NAME`) — Columns: Token | Nome | Email | Data | Adultos | Crianças

### Payment Flow
1. User clicks a gift → dialog opens
2. Frontend POSTs to `/api/pix` with `{title, amount}` (amount in cents)
3. Backend converts to BRL, creates Mercado Pago order (1h expiration)
4. Frontend displays returned QR code image and copyable BR code

### Design System
- Dark theme with glassmorphism (backdrop-filter blur + semi-transparent backgrounds)
- Primary accent: `#7EB6D9`
- All palette values in `palette.ts` — import and use instead of hardcoding colors
- Responsive: MUI Grid with xs/sm breakpoints

## Environment Variables

- `MERCADOPAGO_ACCESS_TOKEN` — Mercado Pago API access token
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` — Google service account email
- `GOOGLE_PRIVATE_KEY` — Google service account private key (newlines as `\n`)
- `GOOGLE_SHEET_ID` — Google Spreadsheet ID
- `GOOGLE_SHEET_TAB_NAME` — (optional) Confirmações tab name; defaults to first sheet tab
- `GOOGLE_CONVITES_TAB_NAME` — (optional) Convites tab name; defaults to `"Convites"`
