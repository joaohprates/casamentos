import { Typography, Box, Divider } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import palette from "../palette";
import VenueMap from "./VenueMap";

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        py: 2.5,
        px: 1,
      }}
    >
      <Box
        sx={{
          mt: 0.3,
          color: palette.olive,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 42,
          height: 42,
          borderRadius: "50%",
          backgroundColor: palette.accentLight,
          border: `1px solid ${palette.border}`,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ textAlign: "left", flex: 1 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-slab)",
            color: palette.olive,
            letterSpacing: 2.5,
            fontSize: "0.7rem",
            fontWeight: 500,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
        <Box sx={{ color: palette.brown }}>{children}</Box>
      </Box>
    </Box>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ mb: { xs: 1.5, sm: 2.5 } }}>
      {subtitle && (
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
          {subtitle}
        </Typography>
      )}
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
        {title}
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
  );
}

function InfoSection() {
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
      <SectionHeader title="Informações" subtitle="O dia" />

      {/* Versículo (PDF: Eclesiastes 4:9-10) */}
      <Box
        sx={{
          mb: 2.5,
          p: 2.5,
          backgroundColor: "rgba(255, 248, 236, 0.55)",
          border: `1px solid ${palette.border}`,
          borderRadius: 3,
        }}
      >
        <MenuBookRoundedIcon sx={{ fontSize: 22, color: palette.olive, mb: 1 }} />
        <Typography
          sx={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            color: palette.brown,
            fontSize: { xs: "1rem", sm: "1.1rem" },
            lineHeight: 1.5,
          }}
        >
          “Melhor é serem dois do que um, porque têm melhor paga do seu trabalho.”
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-slab)",
            color: palette.sage,
            fontSize: "0.75rem",
            letterSpacing: 2,
            mt: 1.5,
            textTransform: "uppercase",
          }}
        >
          Eclesiastes 4:9-10
        </Typography>
      </Box>

      {/* Card principal */}
      <Box
        sx={{
          backgroundColor: "rgba(255, 248, 236, 0.55)",
          border: `1px solid ${palette.border}`,
          borderRadius: 3,
          px: { xs: 2.5, sm: 4 },
          py: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: palette.cardHover,
            boxShadow: "0 12px 32px rgba(64,49,50,0.08)",
          },
        }}
      >
        <InfoItem icon={<CalendarMonthRoundedIcon />} label="Data">
          <Typography
            sx={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.35rem",
              fontWeight: 500,
              color: palette.brown,
            }}
          >
            08 de Novembro de 2026
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "0.92rem",
              color: palette.textMuted,
              mt: 0.3,
            }}
          >
            Domingo
          </Typography>
        </InfoItem>

        <Divider sx={{ borderColor: palette.divider }} />

        <InfoItem icon={<AccessTimeRoundedIcon />} label="Horário">
          <Typography
            sx={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.35rem",
              fontWeight: 500,
              color: palette.brown,
            }}
          >
            16h30
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "0.92rem",
              color: palette.textMuted,
              mt: 0.3,
            }}
          >
            Chegue com 20 min de antecedência
          </Typography>
        </InfoItem>

        <Divider sx={{ borderColor: palette.divider }} />

        <InfoItem icon={<PlaceRoundedIcon />} label="Local">
          <Typography
            sx={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.35rem",
              fontWeight: 500,
              color: palette.brown,
            }}
          >
            Allan'De
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "0.92rem",
              color: palette.textMuted,
              mt: 0.3,
            }}
          >
            Iguatemi – Paraná
          </Typography>
        </InfoItem>
      </Box>

      {/* Mapa */}
      <Box
        sx={{
          mt: 2.5,
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${palette.border}`,
          backgroundColor: "rgba(255, 248, 236, 0.55)",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: palette.cardHover,
            boxShadow: "0 12px 32px rgba(64,49,50,0.08)",
          },
        }}
      >
        <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-slab)",
              color: palette.olive,
              letterSpacing: 2.5,
              fontSize: "0.7rem",
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >
            Como chegar
          </Typography>
        </Box>
        <VenueMap />

        {/* Botão "Abrir no Google Maps" pra rota/navegação */}
        <Box
          component="a"
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("Allan'De Iguatemi PR")}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            py: 1.4,
            borderTop: `1px solid ${palette.divider}`,
            textDecoration: "none",
            fontFamily: "var(--font-slab)",
            color: palette.olive,
            fontSize: "0.78rem",
            fontWeight: 500,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            transition: "background-color 0.2s, color 0.2s",
            "&:hover": {
              backgroundColor: "rgba(117,113,78,0.08)",
              color: palette.oliveDark,
            },
          }}
        >
          <NavigationRoundedIcon sx={{ fontSize: 16 }} />
          Abrir no Google Maps
        </Box>
      </Box>
    </Box>
  );
}

export default InfoSection;
