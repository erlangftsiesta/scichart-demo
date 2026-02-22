import React from "react";
import { Box, Typography } from "@mui/material";
import { TV } from "../../../../Shared/styles/theme";

export interface OhlcLegendData {
  name: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ChartLegendProps {
  data: OhlcLegendData | null;
  visible: boolean;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ data, visible }) => {
  if (!visible || !data) return null;

  const change = data.close - data.open;
  const pct = ((change / data.open) * 100).toFixed(2);
  const color = change >= 0 ? TV.Green : TV.Red;
  const sign = change >= 0 ? "+" : "";

  const fmt = (v: number) => v.toFixed(2);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 8,
        left: 8,
        zIndex: 10,
        pointerEvents: "none", 
        maxWidth: "calc(100% - 60px)", 
        overflow: "hidden",
      }}
    >
      <Typography
        component="span"
        sx={{
          display: "block",
          fontSize: { xs: "11px", sm: "12px" },
          fontWeight: 600,
          color: TV.TextPrimary,
          lineHeight: 1.4,
          mb: "2px",
        }}
      >
        {data.name}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          fontSize: { xs: "11px", sm: "12px" },
          lineHeight: 1.4,
        }}
      >
        <OhlcItem label="O" value={fmt(data.open)} color={color} />
        <OhlcItem label="H" value={fmt(data.high)} color={color} />
        <OhlcItem label="L" value={fmt(data.low)} color={color} />
        <OhlcItem label="C" value={fmt(data.close)} color={color} />
        <Typography
          component="span"
          sx={{ fontSize: "inherit", color, fontWeight: 500 }}
        >
          {sign}
          {fmt(change)} ({sign}
          {pct}%)
        </Typography>
      </Box>
    </Box>
  );
};

const OhlcItem: React.FC<{ label: string; value: string; color: string }> = ({
  label,
  value,
  color,
}) => (
  <Typography
    component="span"
    sx={{ fontSize: "inherit", color: TV.TextMuted, whiteSpace: "nowrap" }}
  >
    {label}{" "}
    <Typography component="span" sx={{ fontSize: "inherit", color }}>
      {value}
    </Typography>
  </Typography>
);
