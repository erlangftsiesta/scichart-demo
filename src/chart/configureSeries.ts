import {
  TSciChart,
  SciChartSurface,
  OhlcDataSeries,
  FastCandlestickRenderableSeries,
  FastOhlcRenderableSeries,
  FastLineRenderableSeries,
  XyMovingAverageFilter,
} from "scichart";
import { appTheme } from "../theme";

export const configureSeries = (
  sciChartSurface: SciChartSurface,
  wasmContext: TSciChart,
) => {
  // The Candlestick Series requires a special dataseries type called OhlcDataSeries with o,h,l,c and date values
  const candleDataSeries = new OhlcDataSeries(wasmContext);

  const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
    dataSeries: candleDataSeries,
    stroke: appTheme.ForegroundColor,
    strokeThickness: 1,
    brushUp: appTheme.TV_Green,
    brushDown: appTheme.TV_Red,
    strokeUp: appTheme.TV_Green,
    strokeDown: appTheme.TV_Red,
  });
  sciChartSurface.renderableSeries.add(candlestickSeries);

  // Add an Ohlcseries (invisible by default)
  const ohlcSeries = new FastOhlcRenderableSeries(wasmContext, {
    dataSeries: candleDataSeries,
    stroke: appTheme.ForegroundColor,
    strokeThickness: 1,
    dataPointWidth: 0.9,
    strokeUp: appTheme.TV_Green,
    strokeDown: appTheme.TV_Red,
    isVisible: false,
  });
  sciChartSurface.renderableSeries.add(ohlcSeries);

  // Add moving averages
  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: new XyMovingAverageFilter(candleDataSeries, {
        dataSeriesName: "Moving Average (20)",
        length: 20,
      }),
      stroke: appTheme.VividSkyBlue,
    }),
  );

  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: new XyMovingAverageFilter(candleDataSeries, {
        dataSeriesName: "Moving Average (50)",
        length: 50,
      }),
      stroke: appTheme.VividPink,
    }),
  );

  return {
    candleDataSeries,
    candlestickSeries,
    ohlcSeries,
  };
};
