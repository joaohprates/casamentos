import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Portal,
} from "@mui/material";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PixRoundedIcon from "@mui/icons-material/PixRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";
import palette from "../palette";

const HAVAN_LISTA_URL = "https://lista.havan.com.br/Convidado/ItensListaPresente/940928";

interface Gift {
  id: number;
  name: string;
  image: string;
  price?: number;
}

type PaymentMethod = "pix" | "boleto" | "fisica";

interface PixData {
  brCode: string;
  brCodeBase64: string;
}

const gifts: Gift[] = [
  { id: 1, name: "Vale jantar de 1 mês de casados para os noivos", image: "", price: 309.75 },
  { id: 2, name: "Ajuda para mobiliar a casa", image: "", price: 990.99 },
  { id: 3, name: "Primeira conta de água da casa dos recém-casados", image: "", price: 215.00 },
  { id: 4, name: "Primeira conta de luz dos recém-casados", image: "", price: 198.00 },
  { id: 5, name: "Vale café da tarde na casa dos noivos (90 dias pós casamento)", image: "", price: 150.00 },
  { id: 6, name: "Cobertor pra noiva que está sempre coberta de razão", image: "", price: 320.00 },
  { id: 7, name: "Compra do mês", image: "", price: 668.94 },
  { id: 8, name: "Drive thru pós casamento", image: "", price: 80.00 },
  { id: 9, name: "Vale gás para o noivo assar pão", image: "", price: 130.00 },
];

function GiftCard({ gift, onSelect }: { gift: Gift; onSelect: () => void }) {
  const available = gift.price != null;
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 248, 236, 0.55)",
        border: `1px solid ${palette.border}`,
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(255, 248, 236, 0.80)",
          transform: "translateY(-4px)",
          boxShadow: "0 12px 32px rgba(64,49,50,0.10)",
          borderColor: palette.borderActive,
        },
      }}
      onClick={onSelect}
    >
      {gift.image && (
        <Box sx={{ width: "100%", height: 160, overflow: "hidden" }}>
          <img
            src={gift.image}
            alt={gift.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Box>
      )}

      <Box sx={{ p: 2 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-serif)",
            color: palette.brown,
            fontWeight: 500,
            fontSize: "1rem",
            mb: 0.5,
            minHeight: "2.6em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {gift.name}
        </Typography>

        <Typography
          sx={{
            fontFamily: "var(--font-serif)",
            color: palette.olive,
            fontWeight: 600,
            fontSize: "1.1rem",
            mb: 1.5,
            fontStyle: "italic",
          }}
        >
          {available ? `R$ ${gift.price!.toFixed(2).replace(".", ",")}` : "A definir"}
        </Typography>

        <Box
          component="button"
          disabled={!available}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            py: 1.1,
            border: `1px solid ${available ? palette.olive : palette.divider}`,
            borderRadius: 2,
            backgroundColor: available ? palette.btnBg : "transparent",
            color: available ? palette.olive : palette.textSubtle,
            cursor: available ? "pointer" : "default",
            fontFamily: "var(--font-slab)",
            fontSize: "0.78rem",
            fontWeight: 500,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            transition: "all 0.25s ease",
            "&:hover": available ? { backgroundColor: palette.btnBgHover } : {},
          }}
        >
          <CardGiftcardRoundedIcon sx={{ fontSize: 17 }} />
          {available ? "Presentear" : "Em breve"}
        </Box>
      </Box>
    </Box>
  );
}

function PixPayment({ gift }: { gift: Gift }) {
  const [pix, setPix] = useState<PixData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPix(null);

    fetch("/api/pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: (gift.price ?? 0) * 100,
        description: `Presente de casamento - ${gift.name}`,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao gerar Pix");
        setPix({ brCode: data.data.brCode, brCodeBase64: data.data.brCodeBase64 });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [gift]);

  const copyCode = useCallback(() => {
    if (!pix) return;
    navigator.clipboard.writeText(pix.brCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [pix]);

  if (loading) {
    return (
      <Box sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <CircularProgress sx={{ color: palette.olive }} />
        <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.textMuted, fontSize: "0.95rem", fontStyle: "italic" }}>
          Gerando QR Code Pix...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: palette.dangerBg,
          border: `1px solid ${palette.danger}55`,
          borderRadius: 3,
          p: 3,
        }}
      >
        <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.danger, fontSize: "0.95rem" }}>
          {error}
        </Typography>
        <Typography sx={{ color: palette.textMuted, fontSize: "0.85rem", mt: 1 }}>
          Tente novamente mais tarde
        </Typography>
      </Box>
    );
  }

  if (!pix) return null;

  return (
    <Box>
      {/* QR Code */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          p: 2,
          display: "inline-block",
          mb: 2,
          border: `1px solid ${palette.border}`,
        }}
      >
        <img
          src={pix.brCodeBase64}
          alt="QR Code Pix"
          style={{ width: 200, height: 200, display: "block" }}
        />
      </Box>

      <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.textMuted, fontSize: "0.9rem", fontStyle: "italic", mb: 2 }}>
        Escaneie o QR Code com o app do seu banco
      </Typography>

      {/* Código copia e cola */}
      <Box
        onClick={copyCode}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          py: 1.3,
          px: 2,
          backgroundColor: palette.btnBg,
          border: `1px solid ${palette.olive}`,
          borderRadius: 2,
          cursor: "pointer",
          transition: "all 0.25s ease",
          "&:hover": { backgroundColor: palette.btnBgHover },
        }}
      >
        {copied ? (
          <CheckRoundedIcon sx={{ fontSize: 18, color: palette.success }} />
        ) : (
          <ContentCopyRoundedIcon sx={{ fontSize: 18, color: palette.olive }} />
        )}
        <Typography
          sx={{
            fontFamily: "var(--font-slab)",
            color: copied ? palette.success : palette.olive,
            fontSize: "0.78rem",
            fontWeight: 500,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          {copied ? "Copiado!" : "Copiar código Pix"}
        </Typography>
      </Box>

      <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.textSubtle, fontSize: "0.78rem", fontStyle: "italic", mt: 2 }}>
        Pagamento via Pix · Expira em 1 hora
      </Typography>
    </Box>
  );
}

const paymentOptions: { id: PaymentMethod; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
  { id: "pix", label: "Pix", sub: "QR Code · Instantâneo", icon: <PixRoundedIcon sx={{ fontSize: 26 }} />, color: palette.olive },
  { id: "boleto", label: "Boleto Bancário", sub: "Vence em 3 dias úteis", icon: <ReceiptLongRoundedIcon sx={{ fontSize: 26 }} />, color: palette.sage },
  { id: "fisica", label: "Entregar Fisicamente", sub: "No dia do casamento", icon: <RedeemRoundedIcon sx={{ fontSize: 26 }} />, color: palette.nude },
];

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function BoletoPayment({ gift }: { gift: Gift }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [nomeError, setNomeError] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [boleto, setBoleto] = useState<{ barCode: string; pdfUrl: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value));
    setCpfError("");
  };

  const handleGenerate = async () => {
    let valid = true;
    const nomePartes = nome.trim().split(/\s+/);
    if (nomePartes.length < 2 || nomePartes.some((p) => p.length < 2)) {
      setNomeError("Informe nome e sobrenome.");
      valid = false;
    }
    const digits = cpf.replace(/\D/g, "");
    if (digits.length !== 11) {
      setCpfError("CPF inválido. Digite os 11 dígitos.");
      valid = false;
    }
    if (!valid) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/boleto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: (gift.price ?? 0) * 100,
          description: `Presente de casamento - ${gift.name}`,
          cpf: digits,
          firstName: nomePartes[0],
          lastName: nomePartes.slice(1).join(" "),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar boleto");
      setBoleto({ barCode: data.data.barCode, pdfUrl: data.data.pdfUrl });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao gerar boleto");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = useCallback(() => {
    if (!boleto) return;
    navigator.clipboard.writeText(boleto.barCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [boleto]);

  if (loading) {
    return (
      <Box sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <CircularProgress sx={{ color: palette.olive }} />
        <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.textMuted, fontSize: "0.95rem", fontStyle: "italic" }}>Gerando boleto...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ backgroundColor: palette.dangerBg, border: `1px solid ${palette.danger}55`, borderRadius: 3, p: 3 }}>
        <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.danger, fontSize: "0.95rem" }}>{error}</Typography>
        <Typography sx={{ color: palette.textMuted, fontSize: "0.85rem", mt: 1 }}>Tente novamente mais tarde</Typography>
      </Box>
    );
  }

  if (boleto) {
    return (
      <Box>
        <Box
          onClick={copyCode}
          sx={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
            py: 1.3, px: 2,
            backgroundColor: palette.btnBg,
            border: `1px solid ${palette.olive}`,
            borderRadius: 2, cursor: "pointer", transition: "all 0.25s ease",
            "&:hover": { backgroundColor: palette.btnBgHover },
          }}
        >
          {copied ? <CheckRoundedIcon sx={{ fontSize: 18, color: palette.success }} /> : <ContentCopyRoundedIcon sx={{ fontSize: 18, color: palette.olive }} />}
          <Typography sx={{ fontFamily: "var(--font-slab)", color: copied ? palette.success : palette.olive, fontSize: "0.78rem", fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase" }}>
            {copied ? "Copiado!" : "Copiar código de barras"}
          </Typography>
        </Box>
        {boleto.pdfUrl && (
          <Box sx={{ mt: 2 }}>
            <a href={boleto.pdfUrl} target="_blank" rel="noreferrer" style={{ fontFamily: "var(--font-serif)", color: palette.olive, fontSize: "0.9rem", fontStyle: "italic", textDecoration: "underline" }}>
              Abrir PDF do boleto
            </a>
          </Box>
        )}
        <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.textSubtle, fontSize: "0.78rem", fontStyle: "italic", mt: 2 }}>
          Pagamento via boleto · Vence em 3 dias úteis
        </Typography>
      </Box>
    );
  }

  const inputSx = (hasError: boolean) => ({
    width: "100%",
    py: 1.3,
    px: 2,
    backgroundColor: "rgba(255,255,255,0.55)",
    border: `1px solid ${hasError ? palette.danger : palette.border}`,
    borderRadius: 2,
    color: palette.brown,
    fontSize: "0.95rem",
    fontFamily: "var(--font-serif)",
    outline: "none",
    boxSizing: "border-box",
    "&:focus": { borderColor: palette.olive },
  });

  return (
    <Box sx={{ textAlign: "left" }}>
      <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.textMuted, fontSize: "0.95rem", fontStyle: "italic", mb: 1.5 }}>
        Informe seus dados para gerar o boleto
      </Typography>

      <Box
        component="input"
        value={nome}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNome(e.target.value); setNomeError(""); }}
        placeholder="Nome completo"
        sx={inputSx(!!nomeError)}
      />
      {nomeError && <Typography sx={{ color: palette.danger, fontSize: "0.78rem", mt: 0.5 }}>{nomeError}</Typography>}

      <Box
        component="input"
        value={cpf}
        onChange={handleCpfChange}
        placeholder="000.000.000-00"
        inputMode="numeric"
        sx={{ ...inputSx(!!cpfError), mt: 1.5, letterSpacing: 2 }}
      />
      {cpfError && (
        <Typography sx={{ color: palette.danger, fontSize: "0.78rem", mt: 0.5 }}>{cpfError}</Typography>
      )}
      <Box
        component="button"
        onClick={handleGenerate}
        sx={{
          mt: 2, width: "100%",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
          py: 1.3,
          border: `1px solid ${palette.olive}`,
          borderRadius: 2,
          backgroundColor: palette.btnBg,
          color: palette.olive,
          cursor: "pointer",
          fontFamily: "var(--font-slab)",
          fontSize: "0.8rem", fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase",
          transition: "all 0.25s ease",
          "&:hover": { backgroundColor: palette.btnBgHover },
        }}
      >
        <ReceiptLongRoundedIcon sx={{ fontSize: 18 }} />
        Gerar Boleto
      </Box>
    </Box>
  );
}

function GiftsSection({ active, onExit }: { active: boolean; onExit: () => void }) {
  const [category, setCategory] = useState<"emocionais" | null>(null);
  const [selected, setSelected] = useState<Gift | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  // Sempre que a aba "Presentes" é aberta, volta para a tela de escolha.
  useEffect(() => {
    if (active) setCategory(null);
  }, [active]);

  const handleClose = () => {
    setSelected(null);
    setPaymentMethod(null);
  };

  const currentOption = paymentOptions.find((o) => o.id === paymentMethod);

  // Tela de escolha — ocupa a tela inteira (portal pra escapar dos contêineres
  // com transform). Duas metades iguais divididas por uma linha, com "ou" no meio.
  if (category === null) {
    if (!active) return null;
    return (
      <Portal>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1200,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(255, 248, 236, 0.94)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            animation: "fadeIn 0.4s ease-out",
            "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
          }}
        >
          <IconButton
            onClick={onExit}
            aria-label="Fechar"
            sx={{ position: "absolute", top: 10, right: 10, zIndex: 2, color: palette.textMuted }}
          >
            <CloseRoundedIcon />
          </IconButton>

          {/* Metade de cima — Presentes Físicos */}
          <Box
            onClick={() => window.open(HAVAN_LISTA_URL, "_blank", "noopener,noreferrer")}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 1,
              px: 4,
              cursor: "pointer",
              userSelect: "none",
              transition: "background-color 0.25s ease",
              "&:hover": { backgroundColor: "rgba(117,113,78,0.07)" },
              "&:active": { backgroundColor: "rgba(117,113,78,0.12)" },
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontFamily: "var(--font-script)",
                color: palette.brown,
                fontSize: { xs: "2.4rem", sm: "3.2rem" },
                lineHeight: 1.05,
                fontWeight: 400,
              }}
            >
              Presentes físicos
            </Typography>
            <Typography sx={{ fontFamily: "var(--font-slab)", fontSize: "0.72rem", letterSpacing: 2.5, textTransform: "uppercase", color: palette.sage }}>
              Lista na Havan
            </Typography>
          </Box>

          {/* Divisor com "ou" — indica que é uma escolha entre um ou outro */}
          <Box sx={{ position: "relative", height: 0, borderTop: `1px solid ${palette.border}` }}>
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: 0,
                transform: "translate(-50%, -50%)",
                px: 1.5,
                py: 0.4,
                borderRadius: "999px",
                border: `1px solid ${palette.border}`,
                backgroundColor: palette.cream,
                fontFamily: "var(--font-slab)",
                fontSize: "0.7rem",
                letterSpacing: 2,
                textTransform: "uppercase",
                color: palette.textMuted,
              }}
            >
              ou
            </Box>
          </Box>

          {/* Metade de baixo — Presentes Emocionais */}
          <Box
            onClick={() => setCategory("emocionais")}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 1,
              px: 4,
              cursor: "pointer",
              userSelect: "none",
              transition: "background-color 0.25s ease",
              "&:hover": { backgroundColor: "rgba(117,113,78,0.07)" },
              "&:active": { backgroundColor: "rgba(117,113,78,0.12)" },
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontFamily: "var(--font-script)",
                color: palette.brown,
                fontSize: { xs: "2.4rem", sm: "3.2rem" },
                lineHeight: 1.05,
                fontWeight: 400,
              }}
            >
              Presentes emocionais
            </Typography>
            <Typography sx={{ fontFamily: "var(--font-slab)", fontSize: "0.72rem", letterSpacing: 2.5, textTransform: "uppercase", color: palette.sage }}>
              Nossa lista especial
            </Typography>
          </Box>
        </Box>
      </Portal>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 640,
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
      {/* Voltar para a escolha de categoria */}
      <Box
        onClick={() => setCategory(null)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          mb: { xs: 1.5, sm: 2 },
          cursor: "pointer",
          color: palette.textMuted,
          transition: "color 0.2s ease",
          "&:hover": { color: palette.olive },
        }}
      >
        <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
        <Typography sx={{ fontFamily: "var(--font-slab)", fontSize: "0.72rem", letterSpacing: 1.8, textTransform: "uppercase" }}>
          Voltar
        </Typography>
      </Box>

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
          Lista de
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
          Presentes
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

      {/* Grid de presentes */}
      <Grid container spacing={2}>
        {gifts.map((gift) => (
          <Grid size={{ xs: 6, sm: 4 }} key={gift.id}>
            <GiftCard gift={gift} onSelect={() => setSelected(gift)} />
          </Grid>
        ))}
      </Grid>

      {/* Dialog de Pagamento */}
      <Dialog
        open={!!selected}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              backgroundColor: palette.dialogBg,
              border: `1px solid ${palette.border}`,
              borderRadius: 4,
              color: palette.brown,
              boxShadow: "0 20px 60px rgba(64,49,50,0.18)",
            },
          },
          backdrop: { sx: { backdropFilter: "blur(6px)", backgroundColor: "rgba(64,49,50,0.30)" } },
        }}
      >
        {selected && (
          <>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {paymentMethod ? (
                  <IconButton onClick={() => setPaymentMethod(null)} sx={{ color: palette.textMuted, p: 0.5, mr: 0.5 }}>
                    <ArrowBackRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                ) : null}
                {currentOption
                  ? <Box sx={{ color: currentOption.color, display: "flex" }}>{currentOption.icon}</Box>
                  : <CardGiftcardRoundedIcon sx={{ color: palette.olive, fontSize: 22 }} />}
                <Typography sx={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "1.15rem", color: palette.brown }}>
                  {currentOption ? currentOption.label : "Como deseja presentear?"}
                </Typography>
              </Box>
              <IconButton onClick={handleClose} sx={{ color: palette.textMuted }}>
                <CloseRoundedIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ textAlign: "center", pt: 2, pb: 4 }}>
              {selected.image && (
                <Box sx={{ width: "100%", height: 140, borderRadius: 3, overflow: "hidden", mb: 2 }}>
                  <img src={selected.image} alt={selected.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              )}

              <Typography sx={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "1.15rem", color: palette.brown, mb: 0.5 }}>
                {selected.name}
              </Typography>
              <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.olive, fontWeight: 600, fontSize: "1.35rem", fontStyle: "italic", mb: 3 }}>
                {selected.price != null ? `R$ ${selected.price.toFixed(2).replace(".", ",")}` : "A definir"}
              </Typography>

              {/* Seleção de método */}
              {!paymentMethod && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {paymentOptions.map((opt) => (
                    <Box
                      key={opt.id}
                      onClick={() => selected.price != null && setPaymentMethod(opt.id)}
                      sx={{
                        display: "flex", alignItems: "center", gap: 2,
                        p: 2, borderRadius: 3, textAlign: "left",
                        border: `1px solid ${selected.price != null ? `${opt.color}66` : palette.divider}`,
                        backgroundColor: selected.price != null ? `${opt.color}14` : "transparent",
                        cursor: selected.price != null ? "pointer" : "default",
                        opacity: selected.price != null ? 1 : 0.45,
                        transition: "all 0.2s ease",
                        "&:hover": selected.price != null ? { backgroundColor: `${opt.color}24`, transform: "translateX(3px)" } : {},
                      }}
                    >
                      <Box sx={{ color: opt.color, display: "flex", flexShrink: 0 }}>{opt.icon}</Box>
                      <Box>
                        <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.brown, fontWeight: 500, fontSize: "1rem" }}>{opt.label}</Typography>
                        <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.textMuted, fontSize: "0.82rem", fontStyle: "italic" }}>{opt.sub}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Pix */}
              {paymentMethod === "pix" && selected.price != null && <PixPayment gift={selected} />}

              {/* Boleto */}
              {paymentMethod === "boleto" && selected.price != null && <BoletoPayment gift={selected} />}

              {/* Entregar fisicamente */}
              {paymentMethod === "fisica" && (
                <Box sx={{ backgroundColor: `${palette.nude}22`, border: `1px solid ${palette.nude}66`, borderRadius: 3, p: 3 }}>
                  <RedeemRoundedIcon sx={{ fontSize: 40, color: palette.nude, mb: 1.5 }} />
                  <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.brown, fontWeight: 500, fontSize: "1.1rem", mb: 1 }}>
                    Que gentileza!
                  </Typography>
                  <Typography sx={{ fontFamily: "var(--font-serif)", color: palette.textMuted, fontSize: "0.95rem", lineHeight: 1.6 }}>
                    Você pode entregar o presente pessoalmente no dia do casamento,{" "}
                    <strong style={{ color: palette.brown }}>08 de novembro em Iguatemi-PR</strong>.
                  </Typography>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default GiftsSection;
