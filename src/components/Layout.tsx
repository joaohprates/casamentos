const video = "https://res.cloudinary.com/dlf3r15qa/video/upload/v1773960348/viideo_tagvjx.mp4";

import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import { animate, createDrawable, stagger } from "animejs";

import GiftsSection from "./GiftsSection";
import InfoSection from "./InfoSection";
import RSVPSection from "./RSVPSection";
import palette from "../palette";
// Import raw da SVG pra inline-ar (necessário pra createDrawable enxergar os <path>)
import logoSvg from "../assets/logo.svg?raw";

export function Layout() {
  const [tipo, setTipo] = useState<"presente" | "info" | "rsvp" | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token") ? "rsvp" : null;
  });

  const logoWrapperRef = useRef<HTMLDivElement | null>(null);
  // Referência estável pra evitar que React re-aplique o innerHTML em cada render
  // (o que destruiria os <path> e perderia o estado da animação anime.js)
  const logoInnerHtml = useMemo(() => ({ __html: logoSvg }), []);
  useEffect(() => {
    const wrapper = logoWrapperRef.current;
    if (!wrapper) return;
    const paths = wrapper.querySelectorAll("path");
    if (paths.length === 0) return;

    // 1) "Desenhar" os contornos progressivamente com stagger entre paths
    //    Stagger ajustado pros ~104 paths do SVG novo (HQ vetorial)
    const STAGGER_MS = 14;
    const drawables = createDrawable(paths);
    animate(drawables, {
      draw: ["0 0", "0 1"],
      ease: "inOutQuad",
      duration: 1400,
      delay: stagger(STAGGER_MS),
    });

    // 2) Depois que os strokes desenharem, fade-in do preenchimento.
    //    Cada path tem `data-target-opacity` com a opacidade ORIGINAL do design
    //    (alguns paths são semi-transparentes pra dar volume/sombra na logo),
    //    então animamos até esse valor — não até 1 cego.
    animate(paths, {
      fillOpacity: (el: SVGPathElement) =>
        parseFloat(el.getAttribute("data-target-opacity") || "1"),
      duration: 900,
      delay: 1000 + paths.length * STAGGER_MS * 0.55,
      ease: "outQuad",
      onComplete: () => {
        // Defesa: força o atributo XML pro valor target (não só inline style).
        // Se algo limpar o style, o atributo mantém o estado final do design.
        paths.forEach((p) => {
          const target = p.getAttribute("data-target-opacity") || "1";
          p.setAttribute("fill-opacity", target);
        });
      },
    });
  }, []);

  return (
    <Box className="layout-root">

      {/* VIDEO FUNDO (mantido, com overlay creme via CSS) */}
      <video autoPlay loop muted playsInline className="video-bg">
        <source src={video} type="video/mp4" />
      </video>

      {/* CONTEÚDO — coluna de vidro fosco descendo pela página */}
      <Box className="layout-center">

        <Box
          className="glass-column"
          sx={{
            /* blur menor (10px vs 22px) + opacidade maior (0.85 vs 0.72) =
               efeito visual quase idêntico mas ~3x mais leve por frame */
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 248, 236, 0.85)",
            borderRadius: 0,
            /* Papel inteiro: cobre a tela toda (full-bleed), sem coluna cortada
               nas laterais. O conteúdo interno é que fica limitado a 720px. */
            width: "100%",
            maxWidth: "100%",
            /* svh = small viewport height (mais consistente que vh no mobile,
               não muda quando a URL bar aparece/some) */
            minHeight: "100svh",
            mx: "auto",
            px: { xs: 2.5, sm: 6 },
            pt: { xs: 2, sm: 3 },
            pb: { xs: 4, sm: 7 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            transform: "translateZ(0)",
            willChange: "backdrop-filter",
          }}
        >
          {/* Espaçador superior — sempre montado pra não desmontar o logo
              (que perderia o estado da animação). Flex muda conforme a aba. */}
          <Box sx={{ flex: tipo === null ? 0.25 : 0, minHeight: 0, width: "100%" }} />

          {/* Logo SVG inline — paths animados via createDrawable + fill fade-in */}
          <Box
            ref={logoWrapperRef}
            role="img"
            aria-label="Islainy & Jônatas — 08 nov 2026"
            sx={{
              width: { xs: 240, sm: 360 },
              maxWidth: "100%",
              "& svg": { width: "100%", height: "auto", display: "block" },
            }}
            dangerouslySetInnerHTML={logoInnerHtml}
          />

          <Typography
            sx={{
              fontFamily: "var(--font-serif)",
              color: palette.olive,
              mt: 1.5,
              fontSize: { xs: "0.82rem", sm: "0.95rem" },
              fontStyle: "italic",
              opacity: 0.85,
              textAlign: "center",
            }}
          >
            Allan'De · Iguatemi-PR
          </Typography>

          {/* Divisor decorativo */}
          <Box
            sx={{
              width: 48,
              height: 1,
              backgroundColor: palette.olive,
              opacity: 0.4,
              mt: 3,
              mb: 0.5,
            }}
          />

          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 1.8 },
            mt: 3,
            justifyContent: "center",
            alignItems: "stretch",
            width: { xs: "100%", sm: "auto" },
          }}>
            {[
              { key: "info" as const, label: "Informações", icon: <InfoOutlinedIcon sx={{ fontSize: 18 }} /> },
              { key: "presente" as const, label: "Presentes", icon: <CardGiftcardRoundedIcon sx={{ fontSize: 18 }} /> },
              { key: "rsvp" as const, label: "Confirmar Presença", labelShort: "Confirmar", icon: <HowToRegRoundedIcon sx={{ fontSize: 18 }} /> },
            ].map(({ key, label, labelShort, icon }) => {
              const active = tipo === key;
              return (
                <Box
                  key={key}
                  onClick={() => setTipo(active ? null : key)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    px: { xs: 2, sm: 2.6 },
                    py: { xs: 1.1, sm: 1.2 },
                    borderRadius: "50px",
                    cursor: "pointer",
                    userSelect: "none",
                    backgroundColor: active ? palette.olive : "rgba(255,248,236,0.6)",
                    border: `1px solid ${active ? palette.olive : palette.border}`,
                    color: active ? palette.cream : palette.brown,
                    transition: "background-color 0.2s ease, border-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: active ? palette.oliveDark : "rgba(117,113,78,0.10)",
                      borderColor: palette.olive,
                    },
                  }}
                >
                  {icon}
                  <Typography
                    sx={{
                      fontFamily: "var(--font-slab)",
                      fontSize: { xs: "0.74rem", sm: "0.78rem" },
                      fontWeight: 500,
                      letterSpacing: { xs: 1.2, sm: 2.2 },
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>{label}</Box>
                    <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>{labelShort ?? label}</Box>
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Espaçador inferior — mesma lógica: sempre montado, flex condicional */}
          <Box sx={{ flex: tipo === null ? 1 : 0, minHeight: 0, width: "100%" }} />

          <div style={{ display: tipo === "info" ? "block" : "none", width: "100%", maxWidth: 720, marginInline: "auto" }}>
            <InfoSection />
          </div>

          <div style={{ display: tipo === "presente" ? "block" : "none", width: "100%", maxWidth: 720, marginInline: "auto" }}>
            <GiftsSection />
          </div>

          <div style={{ display: tipo === "rsvp" ? "block" : "none", width: "100%", maxWidth: 720, marginInline: "auto" }}>
            <RSVPSection />
          </div>
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
