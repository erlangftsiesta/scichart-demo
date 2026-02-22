//? this code for candlestick itself

import {
  TSciChart,
  SciChartSurface,
  OhlcDataSeries,
  FastCandlestickRenderableSeries,
} from "scichart";
import { appTheme } from "../../../../Shared/styles/theme";
import { OhlcLegendData } from "../ui/ChartLegend";

export const configureSeries = (
  sciChartSurface: SciChartSurface,
  wasmContext: TSciChart,
  onOhlcUpdate: (data: OhlcLegendData | null) => void,
) => {
  const candleDataSeries = new OhlcDataSeries(wasmContext, {
    dataSeriesName: "BTC/USDT", 
    containsNaN: false,
    isSorted: true,
  });

  const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
    dataSeries: candleDataSeries,
    strokeThickness: 1,
    brushUp: appTheme.TV_Green,
    brushDown: appTheme.TV_Red,
    strokeUp: appTheme.TV_Green,
    strokeDown: appTheme.TV_Red,
    id: "candlestick-series",
  });

  const tooltipLegendTemplate = (
    _tooltipProps: any,
    seriesInfo: any,
  ): string => {
    if (seriesInfo?.openValue != null) {
      onOhlcUpdate({
        name: "BTC/USDT",
        open: seriesInfo.openValue,
        high: seriesInfo.highValue,
        low: seriesInfo.lowValue,
        close: seriesInfo.closeValue,
      });
    }
    return ""; 
  };

  sciChartSurface.renderableSeries.add(candlestickSeries);

  return { candleDataSeries, candlestickSeries, tooltipLegendTemplate };
};
