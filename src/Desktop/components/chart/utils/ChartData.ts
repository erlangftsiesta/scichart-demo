import {
  OhlcDataSeries,
  AxisBase2D,
  NumberRange,
  easing,
  AnnotationBase,
  LineAnnotation,
} from "scichart";
import { TPriceBar } from "../../../../Shared/types/types";
import { appTheme } from "../../../../Shared/styles/theme";

export const updateLatestPriceAnnotation = (
  latestPriceAnnotation: LineAnnotation,
  priceBar: TPriceBar,
) => {
  latestPriceAnnotation.isHidden = false;
  latestPriceAnnotation.y1 = priceBar.close;
  latestPriceAnnotation.stroke =
    priceBar.close > priceBar.open ? appTheme.TV_Green : appTheme.TV_Red;
  latestPriceAnnotation.axisLabelFill = latestPriceAnnotation.stroke;
};

export const setData = (
  candleDataSeries: OhlcDataSeries,
  latestPriceAnnotation: LineAnnotation,
  symbolName: string,
  priceBars: TPriceBar[],
) => {
  console.log(
    `createCandlestickChart(): Setting data for ${symbolName}, ${priceBars.length} candles`,
  );

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

  candleDataSeries.clear();
  candleDataSeries.appendRange(
    xValues,
    openValues,
    highValues,
    lowValues,
    closeValues,
    priceBars.map((x) => ({ volume: x.volume, isSelected: false })),
  );

  candleDataSeries.dataSeriesName = symbolName;

  updateLatestPriceAnnotation(
    latestPriceAnnotation,
    priceBars[priceBars.length - 1],
  );
};

export const onNewTrade = (
  candleDataSeries: OhlcDataSeries,
  xAxis: AxisBase2D,
  latestPriceAnnotation: LineAnnotation,
  priceBar: TPriceBar,
  tradeSize: number,
  lastTradeBuyOrSell: boolean,
) => {
  const currentIndex = candleDataSeries.count() - 1;
  const getLatestCandleDate = candleDataSeries
    .getNativeXValues()
    .get(currentIndex);
  if (priceBar.date / 1000 === getLatestCandleDate) {
    candleDataSeries.update(
      currentIndex,
      priceBar.open,
      priceBar.high,
      priceBar.low,
      priceBar.close,
      { volume: priceBar.volume, isSelected: false } as any,
    );
  } else {
    candleDataSeries.append(
      priceBar.date / 1000,
      priceBar.open,
      priceBar.high,
      priceBar.low,
      priceBar.close,
      { volume: priceBar.volume, isSelected: false } as any,
    );

    if (xAxis.visibleRange.max > getLatestCandleDate) {
      const dateDifference = priceBar.date / 1000 - getLatestCandleDate;
      const shiftedRange = new NumberRange(
        xAxis.visibleRange.min + dateDifference,
        xAxis.visibleRange.max + dateDifference,
      );
      xAxis.animateVisibleRange(shiftedRange, 250, easing.inOutQuad);
    }
  }
  updateLatestPriceAnnotation(latestPriceAnnotation, priceBar);
};
