//? this code for add some custom feature or chart behaviour that you've been made

import {
  SciChartSurface,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  PinchZoomModifier,
  AnnotationHoverModifier,
  EXyDirection,
} from "scichart";
import { Measurment } from "../tools/Measurement";
import { CrosshairTool } from "../tools/Crosshair";
import { OhlcLegendData } from "../../../../Shared/hooks/useChartLegend";

export const configureModifiers = (sciChartSurface: SciChartSurface, onOhlcUpdate: (data: OhlcLegendData | null) => void) => {
  const zoomPanModifier = new ZoomPanModifier({ enableZoom: true });
  zoomPanModifier.isEnabled = false;

  const pinchZoomModifier = new PinchZoomModifier({
    xyDirection: EXyDirection.XyDirection,
  });
  const mouseWheelZoomModifier = new MouseWheelZoomModifier({
    xyDirection: EXyDirection.XyDirection,
  });

  (pinchZoomModifier as any).scaleFactor = 0.0005;

  const measurmentModifier = new Measurment();
  measurmentModifier.isEnabled = false;

  const crosshairTool = new CrosshairTool(onOhlcUpdate);
  crosshairTool.isEnabled = true;

  sciChartSurface.chartModifiers.add(
    crosshairTool,
    zoomPanModifier,
    pinchZoomModifier,
    mouseWheelZoomModifier,
    measurmentModifier,
    new AnnotationHoverModifier(),
  );

  return {
    crosshairTool,
    zoomPanModifier,
    measurmentModifier,
  };
};
