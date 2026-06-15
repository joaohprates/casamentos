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
  "&text=Casamento+Islainy+%26+J%C3%B4natas" +
  "&dates=20261108T193000Z/20261109T020000Z" + // 16h30 BRT → UTC
  "&location=Allan%27De+-+Iguatemi%2C+PR" +
  "&details=Casamento+Islainy+%26+J%C3%B4natas+%E2%80%A2+Allan%27De+%E2%80%A2+Iguatemi-PR";

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
      color: palette.brown,
      backgroundColor: "rgba(255,255,255,0.55)",
      borderRadius: 2,
      fontFamily: "var(--font-serif)",
      "& fieldset": { borderColor: palette.border },
      "&:hover fieldset": { borderColor: palette.olive },
      "&.Mui-focused fieldset": { borderColor: palette.olive },
    },
    "& .MuiInputLabel-root": {
      color: palette.textMuted,
      fontFamily: "var(--font-slab)",
      "&.Mui-focused": { color: palette.olive },
    },
  };

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: "auto",
        mt: { xs: 2.5, sm: 4 },
        mb: 4,
        width: "100%",
        animation: "fadeSlideUp 0.6s ease-out",
        "@keyframes fadeSlideUp": {
          from: { opacity: 0, transform: "translateY(24px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 1.5, sm: 2.5 } }}>
        <Typography
          sx={{
            fontFamily: "var(--font-slab)",
            fontSize: "0.7rem",
            letterSpacing: 4,
            textTransform: "uppercase",
            color: palette.sage,
            mb: 0.5,
          }}
        >
          Sua
        </Typography>
        <Typography
          component="h2"
          sx={{
            fontFamily: "var(--font-script)",
            color: palette.brown,
            fontSize: { xs: "1.9rem", sm: "2.6rem" },
            lineHeight: 1.1,
            fontWeight: 400,
          }}
        >
          Confirmação
        </Typography>
        <Box
          sx={{
            width: 48,
            height: 1,
            backgroundColor: palette.olive,
            mx: "auto",
            mt: 1.2,
            opacity: 0.5,
          }}
        />
      </Box>

      {/* Card */}
      <Box
        sx={{
          backgroundColor: "rgba(255, 248, 236, 0.55)",
          border: `1px solid ${palette.border}`,
          borderRadius: 3,
          px: { xs: 2.5, sm: 4 },
          py: 3,
          transition: "all 0.3s ease",
        }}
      >
        {success ? (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <CheckCircleOutlineRoundedIcon
              sx={{ fontSize: 56, color: palette.success, mb: 2 }}
            />
            <Typography
              sx={{
                fontFamily: "var(--font-script)",
                color: palette.brown,
                fontSize: "2.2rem",
                lineHeight: 1.1,
                mb: 1,
              }}
            >
              Presença confirmada!
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-serif)",
                color: palette.textMuted,
                fontSize: "1rem",
                fontStyle: "italic",
                mb: 3,
              }}
            >
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
                border: `1px solid ${palette.olive}`,
                borderRadius: 2,
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 0.25s ease",
                "&:hover": { backgroundColor: palette.btnBgHover },
              }}
            >
              <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: palette.olive }} />
              <Typography
                sx={{
                  fontFamily: "var(--font-slab)",
                  color: palette.olive,
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  letterSpacing: 1.5,
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
                    backgroundColor: "rgba(255,255,255,0.55)",
                    color: palette.textMuted,
                    cursor: "pointer",
                    flexShrink: 0,
                    fontFamily: "var(--font-slab)",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    transition: "all 0.2s ease",
                    "&:hover:not(:disabled)": {
                      borderColor: palette.olive,
                      color: palette.olive,
                    },
                    "&:disabled": { opacity: 0.4, cursor: "not-allowed" },
                  }}
                >
                  {tokenStatus === "validating" ? (
                    <CircularProgress size={14} sx={{ color: palette.olive }} />
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
                    backgroundColor: palette.successBg,
                    border: `1px solid ${palette.success}55`,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PeopleRoundedIcon sx={{ fontSize: 18, color: palette.success }} />
                  <Box>
                    <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.success, fontSize: "0.95rem", fontWeight: 500 }}>
                      {familia || "Convite válido"}
                    </Typography>
                    <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.textMuted, fontSize: "0.85rem", fontStyle: "italic" }}>
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
                    backgroundColor: palette.warningBg,
                    border: `1px solid ${palette.warning}55`,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: palette.warning }} />
                  <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.warning, fontSize: "0.95rem" }}>
                    Este convite já foi confirmado
                  </Typography>
                </Box>
              )}

              {tokenStatus === "invalid" && (
                <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.danger, fontSize: "0.88rem", fontStyle: "italic", mt: 1 }}>
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
                    "& .MuiFormHelperText-root": { color: palette.textMuted, fontFamily: "var(--font-serif)", fontStyle: "italic" },
                  }}
                />

                {error && (
                  <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.danger, fontSize: "0.9rem", fontStyle: "italic" }}>
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
                    border: `1px solid ${palette.olive}`,
                    borderRadius: 2,
                    backgroundColor: palette.btnBg,
                    color: palette.olive,
                    cursor: loading ? "wait" : "pointer",
                    fontFamily: "var(--font-slab)",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    transition: "all 0.25s ease",
                    opacity: !name.trim() || !email.trim() ? 0.5 : 1,
                    "&:hover:not(:disabled)": { backgroundColor: palette.btnBgHover },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={18} sx={{ color: palette.olive }} />
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
