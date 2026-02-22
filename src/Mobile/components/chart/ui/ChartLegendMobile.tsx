import React from "react";
import { Box, Typography } from "@mui/material";
import { TV } from "../../../../Shared/styles/theme";
import { useChartLegend, OhlcLegendData } from "../../../../Shared/hooks/useChartLegend";

interface ChartLegendProps {
  data: OhlcLegendData | null;
  visible: boolean;
}

export const ChartLegendMobile: React.FC<ChartLegendProps> = ({ data, visible }) => {
  const { shouldRender, changeData } = useChartLegend(data, visible);

  if (!shouldRender || !data || !changeData) return null;

  const { change, pct, color, sign, fmt } = changeData;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 8,
        left: 8,
        zIndex: 10,
        pointerEvents: "none", 
        maxWidth: "calc(100% - 16px)", 
        overflow: "hidden",
      }}
    >
      <Typography
        component="span"
        sx={{
          display: "block",
          fontSize: "12px",
          fontWeight: 600,
          color: TV.TextPrimary,
          lineHeight: 1.4,
          mb: "4px",
        }}
      >
        {data.name}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          columnGap: "8px",
          rowGap: "2px",
          fontSize: "11px",
          lineHeight: 1.2,
        }}
      >
        <OhlcItem label="O" value={fmt(data.open)} color={color} />
        <OhlcItem label="H" value={fmt(data.high)} color={color} />
        <OhlcItem label="L" value={fmt(data.low)} color={color} />
        <OhlcItem label="C" value={fmt(data.close)} color={color} />
        <Typography
          component="span"
          sx={{ fontSize: "inherit", color, fontWeight: 500, width: "100%" }}
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
