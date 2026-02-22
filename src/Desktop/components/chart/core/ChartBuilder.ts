//? this code do like a compiler on youre fckin C++
//? every customization that we've made on ../chart/config it will be 1 combined components

import { SciChartSurface } from "scichart";
import { TPriceBar } from "../../../../Shared/types/types";
import { appTheme } from "../../../../Shared/styles/theme";
import { configureAxes } from "../config/Axes";
import { configureSeries } from "../config/Series";
import { configureModifiers } from "../config/Modifiers";
import { PriceAnnotation } from "../config/PriceAnnotation";
import { addLineAnnotation } from "../tools/LineAnnotation";
import { addBoxAnnotation } from "../tools/BoxAnnotation";
import { deleteSelectedAnnotations } from "../tools/DeleteAnnotation";
import { setData, onNewTrade } from "../utils/ChartData";
import { setXRange, setTool, toggleCursor } from "./ChartControls";
import { OhlcLegendData } from "../ui/ChartLegend";
import { AnnotationSelectionCallback } from "../utils/AnnotationSelection";

export const createCandlestickChart = async (
  rootElement: string | HTMLDivElement,
  onOhlcUpdate: (data: OhlcLegendData | null) => void,
  onAnnotationSelected?: AnnotationSelectionCallback,
) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    { theme: appTheme.TradingViewTheme },
  );

  // Store callback on the surface so annotation tools can fire it without coupling
  (sciChartSurface as any).__onAnnotationSelected =
    onAnnotationSelected ?? null;

  const { xAxis } = configureAxes(sciChartSurface, wasmContext);
  const { candleDataSeries, tooltipLegendTemplate } = configureSeries(
    sciChartSurface,
    wasmContext,
    onOhlcUpdate,
  );
  const modifiers = configureModifiers(sciChartSurface);
  modifiers.rolloverModifier.tooltipLegendTemplate = tooltipLegendTemplate;

  const { latestPriceAnnotation } = PriceAnnotation(sciChartSurface);

  const controls = {
    setData: (symbolName: string, priceBars: TPriceBar[]) =>
      setData(candleDataSeries, latestPriceAnnotation, symbolName, priceBars),
    onNewTrade: (
      priceBar: TPriceBar,
      tradeSize: number,
      lastTradeBuyOrSell: boolean,
    ) =>
      onNewTrade(
        candleDataSeries,
        xAxis,
        latestPriceAnnotation,
        priceBar,
        tradeSize,
        lastTradeBuyOrSell,
      ),
    setXRange: (startDate: Date, endDate: Date) =>
      setXRange(xAxis, startDate, endDate),
    setTool: (tool: string) => setTool(modifiers, tool),
    toggleCursor: (isEnabled: boolean, onToggle?: (e: boolean) => void) =>
      toggleCursor(modifiers, isEnabled, onToggle),
    addLineAnnotation: () => addLineAnnotation(sciChartSurface, xAxis),
    addBoxAnnotation: () => addBoxAnnotation(sciChartSurface, xAxis),
    deleteSelectedAnnotations: () => deleteSelectedAnnotations(sciChartSurface),
    setAnnotationSelectionCallback: (
      cb: AnnotationSelectionCallback | null,
    ) => {
      (sciChartSurface as any).__onAnnotationSelected = cb;
    },
  };

  return { sciChartSurface, controls };
};
