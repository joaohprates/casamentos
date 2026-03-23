import weddingTitleImg from "../assets/Imagem.png";
const video = "https://res.cloudinary.com/dlf3r15qa/video/upload/v1773960348/viideo_tagvjx.mp4";

import { Box, Typography } from "@mui/material";
import { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";

import GiftsSection from "./GiftsSection";
import InfoSection from "./InfoSection";
import RSVPSection from "./RSVPSection";
import palette from "../palette";

export function Layout() {
  const [tipo, setTipo] = useState<"presente" | "info" | "rsvp" | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token") ? "rsvp" : null;
  });
  return (
    <Box className="layout-root">

      {/* VIDEO FUNDO */}
      <video autoPlay loop muted playsInline className="video-bg">
        <source src={video} type="video/mp4" />
      </video>

      {/* CONTEÚDO */}
      <Box className="layout-center">

        <img
          src={weddingTitleImg}
          alt="Wedding"
          style={{ width: "min(320px, 80vw)" }}
        />

        <Typography
          variant="h6"
          sx={{ color: "white", mt: 2, fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
          8 Nov • Allan'De • Maringá
        </Typography>

        <Box sx={{
          display: "flex",
          gap: { xs: 1.5, sm: 2 },
          mt: 4,
          flexWrap: "wrap",
          justifyContent: "center",
          px: { xs: 2, sm: 0 },
        }}>
          {[
            { key: "info" as const, label: "Informações", icon: <InfoOutlinedIcon sx={{ fontSize: 22 }} /> },
            { key: "presente" as const, label: "Presentes", icon: <CardGiftcardRoundedIcon sx={{ fontSize: 22 }} /> },
            { key: "rsvp" as const, label: "Confirmar Presença", icon: <HowToRegRoundedIcon sx={{ fontSize: 22 }} /> },
          ].map(({ key, label, icon }) => {
            const active = tipo === key;
            return (
              <Box
                key={key}
                onClick={() => setTipo(active ? null : key)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: { xs: 1.5, sm: 3 },
                  py: 1.4,
                  borderRadius: "50px",
                  cursor: "pointer",
                  userSelect: "none",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  backgroundColor: active ? palette.glassActive : palette.glass,
                  border: `1px solid ${active ? palette.borderActive : palette.border}`,
                  color: active ? palette.accent : palette.text,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: active ? palette.glassActive : palette.glassHover,
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                {icon}
                <Typography
                  sx={{
                    fontSize: { xs: "0.78rem", sm: "0.88rem" },
                    fontWeight: 500,
                    letterSpacing: { xs: 1, sm: 1.5 },
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <div style={{ display: tipo === "info" ? "block" : "none", width: "100%" }}>
          <InfoSection />
        </div>

        <div style={{ display: tipo === "presente" ? "block" : "none", width: "100%" }}>
          <GiftsSection />
        </div>

        <div style={{ display: tipo === "rsvp" ? "block" : "none", width: "100%" }}>
          <RSVPSection />
        </div>
      </Box>
    </Box>
  );
}

export default Layout;