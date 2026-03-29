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
  // Aparelhos de jantar
  { id: 1, name: "Aparelho de Jantar e Chá Orgânico", image: "", price: 793.20 },
  { id: 2, name: "Aparelho de Jantar e Chá Cerâmica", image: "", price: 299.90 },
  { id: 3, name: "Aparelho de Jantar e Chá Porcelana", image: "", price: 679.00 },
  // Panelas
  { id: 4, name: "Jogo de Panela Antiaderente", image: "", price: 599.90 },
  { id: 5, name: "Jogo de Panela Tramontina", image: "", price: 517.94 },
  { id: 6, name: "Conjunto de Panelas Cerâmica", image: "", price: 249.99 },
  { id: 7, name: "Panela de Pressão", image: "" },
  // Talheres e utensílios
  { id: 8, name: "Faqueiro 91 Peças", image: "", price: 550.99 },
  { id: 9, name: "Faqueiro 24 Peças", image: "", price: 137.51 },
  { id: 10, name: "Utensílios de Cozinha Silicone", image: "", price: 76.24 },
  { id: 11, name: "Utensílios de Cozinha Silicone e Madeira", image: "", price: 154.00 },
  { id: 12, name: "Jogo para Churrasco", image: "", price: 209.00 },
  // Copos e xícaras
  { id: 13, name: "Jogo de Copos de Vidro Liso", image: "", price: 49.90 },
  { id: 14, name: "Jogo de Copos de Vidro Canelado", image: "", price: 99.00 },
  { id: 15, name: "Jogo de Xícaras Café com Pires", image: "", price: 69.00 },
  { id: 16, name: "Jogo de Xícaras Café Porcelana", image: "", price: 73.38 },
  // Eletrodomésticos
  { id: 17, name: "Liquidificador", image: "", price: 219.00 },
  { id: 18, name: "Microondas", image: "", price: 677.97 },
  { id: 19, name: "Air Fryer", image: "", price: 557.07 },
  { id: 20, name: "Ferro de Passar", image: "", price: 209.90 },
  { id: 21, name: "Aspirador de Pó", image: "", price: 380.54 },
  { id: 22, name: "Batedeira", image: "", price: 329.00 },
  { id: 23, name: "Máquina de Lavar", image: "", price: 2782.01 },
  { id: 24, name: "Lava-Louças", image: "", price: 2999.00 },
  { id: 25, name: "Fogão", image: "", price: 1226.36 },
  { id: 26, name: "Cafeteira", image: "" },
  { id: 27, name: "Forno Elétrico", image: "" },
  // Acessórios
  { id: 28, name: "Garrafa de Café", image: "" },
  { id: 29, name: "Potes Herméticos", image: "" },
  // Móveis
  { id: 30, name: "Mesa de Jantar", image: "", price: 1684.46 },
  { id: 31, name: "Sofá", image: "", price: 2700.00 },
  { id: 32, name: "Aparador Buffet", image: "", price: 499.99 },
  { id: 33, name: "Aparador de Sala", image: "" },
  { id: 34, name: "Guarda-Roupa", image: "", price: 1979.99 },
  { id: 35, name: "Cama", image: "", price: 1519.99 },
  { id: 36, name: "Tapetes", image: "" },
];

function GiftCard({ gift, onSelect }: { gift: Gift; onSelect: () => void }) {
  return (
    <Box
      sx={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        backgroundColor: palette.card,
        border: `1px solid ${palette.divider}`,
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: palette.cardHover,
          transform: "translateY(-4px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
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
          sx={{ color: palette.text, fontWeight: 500, fontSize: "0.95rem", mb: 0.5 }}
        >
          {gift.name}
        </Typography>

        <Typography
          sx={{ color: palette.accent, fontWeight: 600, fontSize: "1.05rem", mb: 1.5 }}
        >
          {gift.price != null ? `R$ ${gift.price.toFixed(2).replace(".", ",")}` : "A definir"}
        </Typography>

        <Box
          component="button"
          disabled={gift.price == null}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            py: 1.2,
            border: gift.price != null ? "1px solid #43a047" : `1px solid ${palette.divider}`,
            borderRadius: 2,
            backgroundColor: gift.price != null ? "rgba(67,160,71,0.18)" : "rgba(255,255,255,0.05)",
            color: gift.price != null ? "#7ef08b" : palette.textMuted,
            cursor: gift.price != null ? "pointer" : "default",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            transition: "all 0.25s ease",
            "&:hover": gift.price != null ? { backgroundColor: "rgba(67,160,71,0.3)" } : {},
          }}
        >
          <CardGiftcardRoundedIcon sx={{ fontSize: 18 }} />
          {gift.price != null ? "Presentear" : "Em breve"}
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
        <CircularProgress sx={{ color: palette.accent }} />
        <Typography sx={{ color: palette.textMuted, fontSize: "0.9rem" }}>
          Gerando QR Code Pix...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: "rgba(255,80,80,0.1)",
          border: "1px solid rgba(255,80,80,0.3)",
          borderRadius: 3,
          p: 3,
        }}
      >
        <Typography sx={{ color: "#ff6b6b", fontSize: "0.9rem" }}>
          {error}
        </Typography>
        <Typography sx={{ color: palette.textMuted, fontSize: "0.8rem", mt: 1 }}>
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
        }}
      >
        <img
          src={pix.brCodeBase64}
          alt="QR Code Pix"
          style={{ width: 200, height: 200, display: "block" }}
        />
      </Box>

      <Typography sx={{ color: palette.textMuted, fontSize: "0.85rem", mb: 2 }}>
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
          border: `1px solid ${palette.accent}`,
          borderRadius: 2,
          cursor: "pointer",
          transition: "all 0.25s ease",
          "&:hover": { backgroundColor: palette.btnBgHover },
        }}
      >
        {copied ? (
          <CheckRoundedIcon sx={{ fontSize: 18, color: "#4caf50" }} />
        ) : (
          <ContentCopyRoundedIcon sx={{ fontSize: 18, color: palette.accent }} />
        )}
        <Typography
          sx={{
            color: copied ? "#4caf50" : palette.accent,
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {copied ? "Copiado!" : "Copiar código Pix"}
        </Typography>
      </Box>

      <Typography sx={{ color: palette.textMuted, fontSize: "0.75rem", mt: 2 }}>
        Pagamento via Pix · Expira em 1 hora
      </Typography>
    </Box>
  );
}

const paymentOptions: { id: PaymentMethod; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
  { id: "pix", label: "Pix", sub: "QR Code · Instantâneo", icon: <PixRoundedIcon sx={{ fontSize: 28 }} />, color: "#4caf50" },
  { id: "boleto", label: "Boleto Bancário", sub: "Vence em 3 dias úteis", icon: <ReceiptLongRoundedIcon sx={{ fontSize: 28 }} />, color: "#7EB6D9" },
  { id: "fisica", label: "Entregar Fisicamente", sub: "No dia do casamento", icon: <RedeemRoundedIcon sx={{ fontSize: 28 }} />, color: "#e0b97a" },
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
        <CircularProgress sx={{ color: "#7EB6D9" }} />
        <Typography sx={{ color: palette.textMuted, fontSize: "0.9rem" }}>Gerando boleto...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ backgroundColor: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 3, p: 3 }}>
        <Typography sx={{ color: "#ff6b6b", fontSize: "0.9rem" }}>{error}</Typography>
        <Typography sx={{ color: palette.textMuted, fontSize: "0.8rem", mt: 1 }}>Tente novamente mais tarde</Typography>
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
            backgroundColor: "rgba(126,182,217,0.15)",
            border: "1px solid #7EB6D9",
            borderRadius: 2, cursor: "pointer", transition: "all 0.25s ease",
            "&:hover": { backgroundColor: "rgba(126,182,217,0.25)" },
          }}
        >
          {copied ? <CheckRoundedIcon sx={{ fontSize: 18, color: "#4caf50" }} /> : <ContentCopyRoundedIcon sx={{ fontSize: 18, color: "#7EB6D9" }} />}
          <Typography sx={{ color: copied ? "#4caf50" : "#7EB6D9", fontSize: "0.85rem", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
            {copied ? "Copiado!" : "Copiar código de barras"}
          </Typography>
        </Box>
        {boleto.pdfUrl && (
          <Box sx={{ mt: 2 }}>
            <a href={boleto.pdfUrl} target="_blank" rel="noreferrer" style={{ color: "#7EB6D9", fontSize: "0.85rem" }}>
              Abrir PDF do boleto
            </a>
          </Box>
        )}
        <Typography sx={{ color: palette.textMuted, fontSize: "0.75rem", mt: 2 }}>
          Pagamento via boleto · Vence em 3 dias úteis
        </Typography>
      </Box>
    );
  }

  const inputSx = (hasError: boolean) => ({
    width: "100%",
    py: 1.3,
    px: 2,
    backgroundColor: "rgba(255,255,255,0.06)",
    border: `1px solid ${hasError ? "#ff6b6b" : palette.divider}`,
    borderRadius: 2,
    color: palette.text,
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    "&:focus": { borderColor: "#7EB6D9" },
  });

  return (
    <Box sx={{ textAlign: "left" }}>
      <Typography sx={{ color: palette.textMuted, fontSize: "0.85rem", mb: 1.5 }}>
        Informe seus dados para gerar o boleto
      </Typography>

      <Box
        component="input"
        value={nome}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNome(e.target.value); setNomeError(""); }}
        placeholder="Nome completo"
        sx={inputSx(!!nomeError)}
      />
      {nomeError && <Typography sx={{ color: "#ff6b6b", fontSize: "0.78rem", mt: 0.5 }}>{nomeError}</Typography>}

      <Box
        component="input"
        value={cpf}
        onChange={handleCpfChange}
        placeholder="000.000.000-00"
        inputMode="numeric"
        sx={{ ...inputSx(!!cpfError), mt: 1.5, letterSpacing: 2 }}
      />
      {cpfError && (
        <Typography sx={{ color: "#ff6b6b", fontSize: "0.78rem", mt: 0.5 }}>{cpfError}</Typography>
      )}
      <Box
        component="button"
        onClick={handleGenerate}
        sx={{
          mt: 2, width: "100%",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
          py: 1.3,
          border: "1px solid #7EB6D9",
          borderRadius: 2,
          backgroundColor: "rgba(126,182,217,0.15)",
          color: "#7EB6D9",
          cursor: "pointer",
          fontSize: "0.85rem", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
          transition: "all 0.25s ease",
          "&:hover": { backgroundColor: "rgba(126,182,217,0.28)" },
        }}
      >
        <ReceiptLongRoundedIcon sx={{ fontSize: 18 }} />
        Gerar Boleto
      </Box>
    </Box>
  );
}

function GiftsSection() {
  const [selected, setSelected] = useState<Gift | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const handleClose = () => {
    setSelected(null);
    setPaymentMethod(null);
  };

  const currentOption = paymentOptions.find((o) => o.id === paymentMethod);

  return (
    <Box
      sx={{
        maxWidth: 640,
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
        <CardGiftcardRoundedIcon sx={{ fontSize: 36, color: palette.accent, mb: 1 }} />
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
          Sugestão de Presentes
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
              border: `1px solid ${palette.divider}`,
              borderRadius: 4,
              color: palette.text,
            },
          },
          backdrop: { sx: { backdropFilter: "blur(6px)" } },
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
                  : <CardGiftcardRoundedIcon sx={{ color: palette.accent, fontSize: 22 }} />}
                <Typography sx={{ fontWeight: 600, fontSize: "1.1rem", color: palette.text }}>
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

              <Typography sx={{ fontWeight: 600, fontSize: "1.1rem", mb: 0.5 }}>
                {selected.name}
              </Typography>
              <Typography sx={{ color: palette.accent, fontWeight: 700, fontSize: "1.3rem", mb: 3 }}>
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
                        border: `1px solid ${selected.price != null ? `${opt.color}55` : palette.divider}`,
                        backgroundColor: selected.price != null ? `${opt.color}12` : "rgba(255,255,255,0.03)",
                        cursor: selected.price != null ? "pointer" : "default",
                        opacity: selected.price != null ? 1 : 0.45,
                        transition: "all 0.2s ease",
                        "&:hover": selected.price != null ? { backgroundColor: `${opt.color}22`, transform: "translateX(3px)" } : {},
                      }}
                    >
                      <Box sx={{ color: opt.color, display: "flex", flexShrink: 0 }}>{opt.icon}</Box>
                      <Box>
                        <Typography sx={{ color: palette.text, fontWeight: 600, fontSize: "0.95rem" }}>{opt.label}</Typography>
                        <Typography sx={{ color: palette.textMuted, fontSize: "0.78rem" }}>{opt.sub}</Typography>
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
                <Box sx={{ backgroundColor: "rgba(224,185,122,0.1)", border: "1px solid rgba(224,185,122,0.3)", borderRadius: 3, p: 3 }}>
                  <RedeemRoundedIcon sx={{ fontSize: 40, color: "#e0b97a", mb: 1.5 }} />
                  <Typography sx={{ color: palette.text, fontWeight: 600, fontSize: "1rem", mb: 1 }}>
                    Que gentileza!
                  </Typography>
                  <Typography sx={{ color: palette.textMuted, fontSize: "0.88rem", lineHeight: 1.6 }}>
                    Você pode entregar o presente pessoalmente no dia do casamento,{" "}
                    <strong style={{ color: palette.text }}>8 de novembro em Maringá</strong>.
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
