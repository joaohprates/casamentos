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
import palette from "../palette";

interface Gift {
  id: number;
  name: string;
  image: string;
  price: number;
}

interface PixData {
  brCode: string;
  brCodeBase64: string;
}

const gifts: Gift[] = [
  { id: 1, name: "Jogo de Panelas", image: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=400&h=300&fit=crop", price: 350 },
  { id: 2, name: "Jogo de Cama", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop", price: 280 },
  { id: 3, name: "Cafeteira", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop", price: 450 },
  { id: 4, name: "Jogo de Toalhas", image: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=400&h=300&fit=crop", price: 180 },
  { id: 5, name: "Liquidificador", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=300&fit=crop", price: 200 },
  { id: 6, name: "Aparelho de Jantar", image: "https://images.unsplash.com/photo-1603199506016-5d54ebfb0e51?w=400&h=300&fit=crop", price: 520 },
  { id: 7, name: "Air Fryer", image: "https://images.unsplash.com/photo-1648455166843-34a45730e33e?w=400&h=300&fit=crop", price: 600 },
  { id: 8, name: "Aspirador Robô", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop", price: 900 },
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

      <Box sx={{ p: 2 }}>
        <Typography
          sx={{ color: palette.text, fontWeight: 500, fontSize: "0.95rem", mb: 0.5 }}
        >
          {gift.name}
        </Typography>

        <Typography
          sx={{ color: palette.accent, fontWeight: 600, fontSize: "1.05rem", mb: 1.5 }}
        >
          R$ {gift.price.toFixed(2).replace(".", ",")}
        </Typography>

        <Box
          component="button"
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            py: 1.2,
            border: `1px solid ${palette.accent}`,
            borderRadius: 2,
            backgroundColor: palette.btnBg,
            color: palette.accent,
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            transition: "all 0.25s ease",
            "&:hover": { backgroundColor: palette.btnBgHover },
          }}
        >
          <CardGiftcardRoundedIcon sx={{ fontSize: 18 }} />
          Presentear
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
        amount: gift.price * 100,
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

function GiftsSection() {
  const [selected, setSelected] = useState<Gift | null>(null);

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
          Lista de Presentes
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

      {/* Dialog de Pagamento PIX */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
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
          backdrop: {
            sx: { backdropFilter: "blur(6px)" },
          },
        }}
      >
        {selected && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pb: 0,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PixRoundedIcon sx={{ color: palette.accent, fontSize: 22 }} />
                <Typography sx={{ fontWeight: 600, fontSize: "1.1rem", color: palette.text }}>
                  Pagar com Pix
                </Typography>
              </Box>
              <IconButton onClick={() => setSelected(null)} sx={{ color: palette.textMuted }}>
                <CloseRoundedIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ textAlign: "center", pt: 2, pb: 4 }}>
              <Box
                sx={{ width: "100%", height: 160, borderRadius: 3, overflow: "hidden", mb: 2 }}
              >
                <img
                  src={selected.image}
                  alt={selected.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>

              <Typography sx={{ fontWeight: 600, fontSize: "1.2rem", mb: 0.5 }}>
                {selected.name}
              </Typography>

              <Typography
                sx={{ color: palette.accent, fontWeight: 700, fontSize: "1.4rem", mb: 3 }}
              >
                R$ {selected.price.toFixed(2).replace(".", ",")}
              </Typography>

              <PixPayment gift={selected} />
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default GiftsSection;
