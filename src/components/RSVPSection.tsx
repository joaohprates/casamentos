import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import palette from "../palette";

const GOOGLE_CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=Casamento+Allan%27De" +
  "&dates=20261108T160000/20261108T230000" +
  "&location=Maring%C3%A1+%E2%80%93+PR" +
  "&details=Casamento+Allan%27De+%E2%80%A2+Maring%C3%A1";

type TokenStatus = "idle" | "validating" | "valid" | "invalid" | "used";

function RSVPSection() {
  const [token, setToken] = useState("");
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("idle");
  const [familia, setFamilia] = useState("");
  const [adultos, setAdultos] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [criancas, setCriancas] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      setToken(urlToken);
      runValidateToken(urlToken);
    }
  }, []);

  const runValidateToken = async (t: string) => {
    const trimmed = t.trim();
    if (!trimmed) return;
    setTokenStatus("validating");
    setError(null);
    try {
      const res = await fetch(`/api/validate-token?token=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (res.ok) {
        setFamilia(data.familia);
        setAdultos(data.adultos);
        setTokenStatus("valid");
      } else if (res.status === 409) {
        setTokenStatus("used");
      } else {
        setTokenStatus("invalid");
      }
    } catch {
      setTokenStatus("invalid");
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || tokenStatus !== "valid") return;

    const criancasCount = criancas.trim() === "" ? 0 : parseInt(criancas.trim(), 10);
    if (!Number.isFinite(criancasCount) || criancasCount < 0) {
      setError("Número de crianças inválido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token.trim(),
          name: name.trim(),
          email: email.trim(),
          criancas: criancasCount,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao confirmar presença");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao confirmar presença");
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: palette.text,
      backgroundColor: "rgba(255,255,255,0.06)",
      borderRadius: 2,
      "& fieldset": { borderColor: palette.border },
      "&:hover fieldset": { borderColor: palette.accent },
      "&.Mui-focused fieldset": { borderColor: palette.accent },
    },
    "& .MuiInputLabel-root": {
      color: palette.textMuted,
      "&.Mui-focused": { color: palette.accent },
    },
  };

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: "auto",
        mt: 3,
        mb: 4,
        px: { xs: 2, sm: 0 },
        animation: "fadeSlideUp 0.6s ease-out",
        "@keyframes fadeSlideUp": {
          from: { opacity: 0, transform: "translateY(24px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <HowToRegRoundedIcon sx={{ fontSize: 36, color: palette.accent, mb: 1 }} />
        <Typography
          variant="h5"
          sx={{
            color: palette.text,
            fontWeight: 300,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontSize: "1.1rem",
          }}
        >
          Confirmar Presença
        </Typography>
        <Box
          sx={{
            width: 48,
            height: 1.5,
            backgroundColor: palette.accent,
            mx: "auto",
            mt: 1.5,
            borderRadius: 1,
          }}
        />
      </Box>

      {/* Card */}
      <Box
        sx={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          backgroundColor: palette.card,
          border: `1px solid ${palette.divider}`,
          borderRadius: 4,
          px: { xs: 2.5, sm: 4 },
          py: 3,
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: palette.cardHover,
            boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          },
        }}
      >
        {success ? (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <CheckCircleOutlineRoundedIcon
              sx={{ fontSize: 56, color: "#4caf50", mb: 2 }}
            />
            <Typography
              sx={{ color: palette.text, fontSize: "1.1rem", fontWeight: 500, mb: 1 }}
            >
              Presença confirmada!
            </Typography>
            <Typography sx={{ color: palette.textMuted, fontSize: "0.9rem", mb: 3 }}>
              Obrigado, {name}! Nos vemos lá.
            </Typography>

            <Box
              component="a"
              href={GOOGLE_CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 3,
                py: 1.3,
                backgroundColor: palette.btnBg,
                border: `1px solid ${palette.accent}`,
                borderRadius: 2,
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 0.25s ease",
                "&:hover": { backgroundColor: palette.btnBgHover },
              }}
            >
              <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: palette.accent }} />
              <Typography
                sx={{
                  color: palette.accent,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Adicionar à agenda
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

            {/* Token input */}
            <Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  label="Código do convite"
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value);
                    setTokenStatus("idle");
                  }}
                  onBlur={() => runValidateToken(token)}
                  fullWidth
                  size="small"
                  sx={inputSx}
                />
                <Box
                  component="button"
                  onClick={() => runValidateToken(token)}
                  disabled={tokenStatus === "validating" || !token.trim()}
                  sx={{
                    px: 2,
                    borderRadius: 2,
                    border: `1px solid ${palette.border}`,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    color: palette.textMuted,
                    cursor: "pointer",
                    flexShrink: 0,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    transition: "all 0.2s ease",
                    "&:hover:not(:disabled)": {
                      borderColor: palette.accent,
                      color: palette.accent,
                    },
                    "&:disabled": { opacity: 0.4, cursor: "not-allowed" },
                  }}
                >
                  {tokenStatus === "validating" ? (
                    <CircularProgress size={14} sx={{ color: palette.accent }} />
                  ) : (
                    "OK"
                  )}
                </Box>
              </Box>

              {/* Token feedback */}
              {tokenStatus === "valid" && (
                <Box
                  sx={{
                    mt: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "rgba(76,175,80,0.1)",
                    border: "1px solid rgba(76,175,80,0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PeopleRoundedIcon sx={{ fontSize: 18, color: "#4caf50" }} />
                  <Box>
                    <Typography sx={{ color: "#4caf50", fontSize: "0.88rem", fontWeight: 600 }}>
                      {familia || "Convite válido"}
                    </Typography>
                    <Typography sx={{ color: palette.textMuted, fontSize: "0.8rem" }}>
                      {adultos} {adultos === 1 ? "adulto" : "adultos"} confirmado{adultos === 1 ? "" : "s"} por este convite
                    </Typography>
                  </Box>
                </Box>
              )}

              {tokenStatus === "used" && (
                <Box
                  sx={{
                    mt: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "rgba(255,152,0,0.1)",
                    border: "1px solid rgba(255,152,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: "#ff9800" }} />
                  <Typography sx={{ color: "#ff9800", fontSize: "0.88rem" }}>
                    Este convite já foi confirmado
                  </Typography>
                </Box>
              )}

              {tokenStatus === "invalid" && (
                <Typography sx={{ color: "#ff6b6b", fontSize: "0.82rem", mt: 1 }}>
                  Código não encontrado. Verifique o convite e tente novamente.
                </Typography>
              )}
            </Box>

            {/* Form fields — only shown after valid token */}
            {tokenStatus === "valid" && (
              <>
                <TextField
                  label="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  size="small"
                  sx={inputSx}
                />

                <TextField
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  size="small"
                  sx={inputSx}
                />

                <TextField
                  label="Crianças (opcional)"
                  helperText="Menores de 12 anos que virão com você"
                  type="text"
                  value={criancas}
                  onChange={(e) => setCriancas(e.target.value.replace(/\D/g, ""))}
                  fullWidth
                  size="small"
                  slotProps={{
                    htmlInput: { inputMode: "numeric", pattern: "[0-9]*" },
                  }}
                  sx={{
                    ...inputSx,
                    "& .MuiFormHelperText-root": { color: palette.textMuted },
                  }}
                />

                {error && (
                  <Typography sx={{ color: "#ff6b6b", fontSize: "0.85rem" }}>
                    {error}
                  </Typography>
                )}

                <Box
                  component="button"
                  onClick={handleSubmit}
                  disabled={loading || !name.trim() || !email.trim()}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    py: 1.3,
                    border: `1px solid ${palette.accent}`,
                    borderRadius: 2,
                    backgroundColor: palette.btnBg,
                    color: palette.accent,
                    cursor: loading ? "wait" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    transition: "all 0.25s ease",
                    opacity: !name.trim() || !email.trim() ? 0.5 : 1,
                    "&:hover:not(:disabled)": { backgroundColor: palette.btnBgHover },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={18} sx={{ color: palette.accent }} />
                  ) : (
                    <>
                      <HowToRegRoundedIcon sx={{ fontSize: 18 }} />
                      Confirmar
                    </>
                  )}
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default RSVPSection;
