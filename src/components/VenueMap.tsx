import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import palette from "../palette";

// Allan'De — Iguatemi, Maringá-PR (coordenadas aproximadas — ajustar se necessário)
const VENUE_LAT = -23.3667;
const VENUE_LNG = -52.0467;

export default function VenueMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const container = containerRef.current;

    const map = L.map(container, {
      center: [VENUE_LAT, VENUE_LNG],
      zoom: 15,
      scrollWheelZoom: true,
      attributionControl: true,
      zoomControl: true,
    });

    // CartoDB Positron — tiles minimalistas, escalam perfeitamente sem
    // seams. CSS filter abaixo afina pra paleta cream/sage do site.
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap &copy; CartoDB',
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    // Marker custom em oliva com aro creme
    const markerIcon = L.divIcon({
      className: "venue-marker",
      html: `<div style="
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #75714e;
        border: 3px solid #fff8ec;
        box-shadow: 0 2px 8px rgba(64,49,50,0.35);
      "></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    L.marker([VENUE_LAT, VENUE_LNG], { icon: markerIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family: 'Cormorant Garamond', serif; color: #403132; padding: 6px 4px;">
          <strong style="font-size: 1.1rem;">Allan'De</strong><br/>
          <em style="font-size: 0.85rem; color: rgba(64,49,50,0.65);">Iguatemi &ndash; PR</em>
        </div>`
      );

    mapRef.current = map;

    // ResizeObserver: detecta quando o container ganha/muda tamanho
    // (ex: a aba "Informações" abre e o container sai de display:none).
    // Sem isso, o Leaflet só carrega 1 tile porque foi inicializado em 0x0px.
    const ro = new ResizeObserver(() => {
      map.invalidateSize();
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: 280,
        position: "relative",
        outline: "none",
        // Filtro pra alinhar com paleta cream/sage/oliva + dar mais contraste:
        //   sepia(0.32)        → aquece o cinza, papel envelhecido leve
        //   hue-rotate(-8deg)  → desloca pra tom oliva/sage
        //   saturate(0.85)     → dessatura um pouco (paleta é earthy)
        //   contrast(1.18)     → boost de contraste — ruas saltam do terreno
        //   brightness(0.93)   → escurece geral pra terra/ruas terem peso
        filter: "sepia(0.32) hue-rotate(-8deg) saturate(0.85) contrast(1.18) brightness(0.93)",
        // Camada oliva translúcida por cima — tint da paleta + leve escurecimento
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 400, // entre tiles e markers
          backgroundColor: "rgba(117, 113, 78, 0.10)", // oliva da paleta
          mixBlendMode: "multiply",
        },
        // Customiza popups e controles do Leaflet pra paleta do site
        "& .leaflet-popup-content-wrapper": {
          backgroundColor: "#fff8ec",
          border: `1px solid ${palette.border}`,
          borderRadius: "8px",
          boxShadow: "0 8px 24px rgba(64,49,50,0.12)",
        },
        "& .leaflet-popup-content": { margin: "8px 12px" },
        "& .leaflet-popup-tip": { background: "#fff8ec" },
        "& .leaflet-popup-close-button": {
          color: `${palette.textMuted} !important`,
          padding: "4px 8px !important",
        },
        "& .leaflet-control-zoom": {
          border: `1px solid ${palette.border} !important`,
          borderRadius: "6px !important",
          overflow: "hidden",
        },
        "& .leaflet-control-zoom a": {
          backgroundColor: "#fff8ec !important",
          color: `${palette.olive} !important`,
          border: "none !important",
          fontFamily: "var(--font-serif)",
          fontWeight: "500 !important",
          "&:hover": { backgroundColor: "rgba(117,113,78,0.08) !important" },
        },
        "& .leaflet-control-attribution": {
          backgroundColor: "rgba(255,248,236,0.85) !important",
          color: `${palette.textMuted} !important`,
          fontSize: "0.65rem !important",
          fontFamily: "var(--font-serif)",
          "& a": { color: `${palette.olive} !important` },
        },
      }}
    />
  );
}
