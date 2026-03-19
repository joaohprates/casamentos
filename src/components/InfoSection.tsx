import { Typography, Box, Divider } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ChurchRoundedIcon from "@mui/icons-material/ChurchRounded";
import palette from "../palette";

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
          color: palette.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: palette.accentLight,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ textAlign: "left" }}>
        <Typography
          variant="overline"
          sx={{
            color: palette.accent,
            letterSpacing: 2.5,
            fontSize: "0.7rem",
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>
        <Box sx={{ color: palette.text }}>{children}</Box>
      </Box>
    </Box>
  );
}

function InfoSection() {
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
      {/* Header decorativo */}
      <Box sx={{ mb: 3 }}>
        <ChurchRoundedIcon
          sx={{ fontSize: 36, color: palette.accent, mb: 1 }}
        />
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
          Informações
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

      {/* Card glassmorphism */}
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
        <InfoItem
          icon={<CalendarMonthRoundedIcon />}
          label="Data"
        >
          <Typography sx={{ fontSize: "1.15rem", fontWeight: 500 }}>
            -- de mês de 202-
          </Typography>
          <Typography
            sx={{ fontSize: "0.85rem", color: palette.textMuted, mt: 0.3 }}
          >
            Sábado
          </Typography>
        </InfoItem>

        <Divider sx={{ borderColor: palette.divider }} />

        <InfoItem
          icon={<AccessTimeRoundedIcon />}
          label="Horário"
        >
          <Typography sx={{ fontSize: "1.15rem", fontWeight: 500 }}>
            --h--
          </Typography>
          <Typography
            sx={{ fontSize: "0.85rem", color: palette.textMuted, mt: 0.3 }}
          >
            Chegada recomendada às --h--
          </Typography>
        </InfoItem>

        <Divider sx={{ borderColor: palette.divider }} />

        <InfoItem
          icon={<PlaceRoundedIcon />}
          label="Local"
        >
          <Typography sx={{ fontSize: "1.15rem", fontWeight: 500 }}>
            Local
          </Typography>
          <Typography
            sx={{ fontSize: "0.85rem", color: palette.textMuted, mt: 0.3 }}
          >
            Km 162,5 · 200m · Maringá – PR
          </Typography>
        </InfoItem>
      </Box>

      {/* Mapa */}
      <Box
        sx={{
          mt: 2.5,
          borderRadius: 4,
          overflow: "hidden",
          border: `1px solid ${palette.divider}`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          backgroundColor: palette.card,
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: palette.cardHover,
            boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          },
        }}
      >
        <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
          <Typography
            variant="overline"
            sx={{
              color: palette.accent,
              letterSpacing: 2.5,
              fontSize: "0.7rem",
              fontWeight: 600,
            }}
          >
            Como chegar
          </Typography>
        </Box>
        <iframe
          title="Localização"
          src="https://www.google.com/maps?q=Allan'De%20Maring%C3%A1&output=embed"
          style={{
            border: 0,
            width: "100%",
            height: 280,
            display: "block",
          }}
          loading="lazy"
        />
      </Box>
    </Box>
  );
}

export default InfoSection;
