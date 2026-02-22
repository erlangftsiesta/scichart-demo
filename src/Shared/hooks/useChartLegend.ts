import { TV } from "../styles/theme";

export interface OhlcLegendData {
  name: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function useChartLegend(data: OhlcLegendData | null, visible: boolean) {
  if (!visible || !data) {
    return { shouldRender: false, data: null, changeData: null };
  }

  const change = data.close - data.open;
  const pct = ((change / data.open) * 100).toFixed(2);
  const color = change >= 0 ? TV.Green : TV.Red;
  const sign = change >= 0 ? "+" : "";

  const fmt = (v: number) => v.toFixed(2);

  return {
    shouldRender: true,
    data,
    changeData: {
      change,
      pct,
      color,
      sign,
      fmt,
    },
  };
}
