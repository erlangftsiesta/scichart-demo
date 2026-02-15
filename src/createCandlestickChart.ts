import { easing, NumberRange, SciChartSurface } from "scichart";
import { TPriceBar } from "./binanceRestClient";
import { appTheme } from "./theme";
import { configureAxes } from "./chart/configureAxes";
import { configureSeries } from "./chart/configureSeries";
import { configureModifiers } from "./chart/configureModifiers";
import { configureAnnotations } from "./chart/configureAnnotations";

export const createCandlestickChart = async (
  rootElement: string | HTMLDivElement,
) => {
  // Create a SciChartSurface
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: appTheme.TradingViewTheme,
    },
  );

  // Initialize chart components using modules
  const { xAxis } = configureAxes(sciChartSurface, wasmContext);
  const { candleDataSeries, candlestickSeries, ohlcSeries } = configureSeries(
    sciChartSurface,
    wasmContext,
  );
  configureModifiers(sciChartSurface);
  const { latestPriceAnnotation } = configureAnnotations(sciChartSurface);

  // Update the latest price annotation position & colour
  const updateLatestPriceAnnotation = (priceBar: TPriceBar) => {
    latestPriceAnnotation.isHidden = false;
    latestPriceAnnotation.y1 = priceBar.close;
    latestPriceAnnotation.stroke =
      priceBar.close > priceBar.open ? appTheme.TV_Green : appTheme.TV_Red;
    latestPriceAnnotation.axisLabelFill = latestPriceAnnotation.stroke;
  };

  // Setup functions to return to caller to control the candlestick chart
  const setData = (symbolName: string, priceBars: TPriceBar[]) => {
    console.log(
      `createCandlestickChart(): Setting data for ${symbolName}, ${priceBars.length} candles`,
    );

    // Maps PriceBar { date, open, high, low, close, volume } to structure-of-arrays expected by scichart
    const xValues: number[] = [];
    const openValues: number[] = [];
    const highValues: number[] = [];
    const lowValues: number[] = [];
    const closeValues: number[] = [];
    priceBars.forEach((priceBar: any) => {
      xValues.push(priceBar.date);
      openValues.push(priceBar.open);
      highValues.push(priceBar.high);
      lowValues.push(priceBar.low);
      closeValues.push(priceBar.close);
    });

    // Clear the dataseries and re-add data
    candleDataSeries.clear();
    candleDataSeries.appendRange(
      xValues,
      openValues,
      highValues,
      lowValues,
      closeValues,
      priceBars.map((x) => ({ volume: x.volume, isSelected: false })),
    );

    // Set the candle data series name (used by tooltips / legends)
    candleDataSeries.dataSeriesName = symbolName;

    // Update the priceBarAnnotation
    updateLatestPriceAnnotation(priceBars[priceBars.length - 1]);
  };

  const onNewTrade = (
    priceBar: TPriceBar,
    tradeSize: number,
    lastTradeBuyOrSell: boolean,
  ) => {
    // On new price bar from the exchange, we want to append or update the existing one (based on time)
    const currentIndex = candleDataSeries.count() - 1;
    const getLatestCandleDate = candleDataSeries
      .getNativeXValues()
      .get(currentIndex);
    if (priceBar.date / 1000 === getLatestCandleDate) {
      // Case where the exchange sends a candle which is already on the chart, update it
      candleDataSeries.update(
        currentIndex,
        priceBar.open,
        priceBar.high,
        priceBar.low,
        priceBar.close,
      );
    } else {
      // Case where the exchange sends a new candle, append it
      candleDataSeries.append(
        priceBar.date / 1000,
        priceBar.open,
        priceBar.high,
        priceBar.low,
        priceBar.close,
      );

      // Is the latest candle in the viewport?
      if (xAxis.visibleRange.max > getLatestCandleDate) {
        // If so, shift the xAxis by one candle
        const dateDifference = priceBar.date / 1000 - getLatestCandleDate;
        const shiftedRange = new NumberRange(
          xAxis.visibleRange.min + dateDifference,
          xAxis.visibleRange.max + dateDifference,
        );
        xAxis.animateVisibleRange(shiftedRange, 250, easing.inOutQuad);
      }
    }
    // Update the latest price line annotation
    updateLatestPriceAnnotation(priceBar);
  };

  const setXRange = (startDate: Date, endDate: Date) => {
    console.log(
      `createCandlestickChart(): Setting chart range to ${startDate} - ${endDate}`,
    );
    xAxis.visibleRange = new NumberRange(
      startDate.getTime() / 1000,
      endDate.getTime() / 1000,
    );
  };

  const enableCandlestick = () => {
    candlestickSeries.isVisible = true;
    ohlcSeries.isVisible = false;
  };

  const enableOhlc = () => {
    candlestickSeries.isVisible = false;
    ohlcSeries.isVisible = true;
  };

  return {
    sciChartSurface,
    controls: { setData, onNewTrade, setXRange, enableCandlestick, enableOhlc },
  };
};
