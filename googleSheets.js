import { google } from "googleapis";

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function getConfirmacoesTab(sheets) {
  if (process.env.GOOGLE_SHEET_TAB_NAME) {
    return process.env.GOOGLE_SHEET_TAB_NAME;
  }
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    fields: "sheets.properties.title",
  });
  const title = spreadsheet.data.sheets?.[0]?.properties?.title;
  if (!title) throw new Error("Nenhuma aba encontrada na planilha");
  return title;
}

function getConvitesTab() {
  return process.env.GOOGLE_CONVITES_TAB_NAME || "Convites";
}

export async function validateToken(token) {
  const sheets = await getSheetsClient();
  const tab = getConvitesTab();

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${tab}!A:D`,
  });

  const rows = result.data.values || [];

  // row 0 = header, skip it
  for (let i = 1; i < rows.length; i++) {
    const [rowToken, familia, adultos, confirmado] = rows[i];
    if (rowToken === token) {
      if (confirmado) {
        return { valid: false, reason: "already_used" };
      }
      return {
        valid: true,
        familia: familia || "",
        adultos: parseInt(adultos, 10) || 1,
        sheetRowIndex: i + 1, // 1-based sheet row
      };
    }
  }

  return { valid: false, reason: "not_found" };
}

async function markTokenAsUsed(token, timestamp) {
  const sheets = await getSheetsClient();
  const tab = getConvitesTab();

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${tab}!A:A`,
  });

  const rows = result.data.values || [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === token) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${tab}!D${i + 1}`,
        valueInputOption: "RAW",
        requestBody: { values: [[timestamp]] },
      });
      return;
    }
  }
}

export async function saveRsvpToSheet({ token, name, email, adultos, criancas }) {
  const sheets = await getSheetsClient();
  const sheetTitle = await getConfirmacoesTab(sheets);

  const timestamp = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  // Columns: Token | Nome | Email | Data | Adultos | Crianças
  const row = [token, name.trim(), email.trim(), timestamp, String(adultos), String(criancas)];

  const appendResult = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${sheetTitle}!A:F`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });

  await markTokenAsUsed(token, timestamp);

  return {
    row,
    sheetTitle,
    updatedRange: appendResult.data.updates?.updatedRange ?? "",
  };
}
