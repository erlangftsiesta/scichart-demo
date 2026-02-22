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
import { createCursorModifier } from "../tools/Cursor";

export const configureModifiers = (sciChartSurface: SciChartSurface) => {
  const zoomPanModifier = new ZoomPanModifier({ enableZoom: true });
  zoomPanModifier.isEnabled = false;

  const pinchZoomModifier = new PinchZoomModifier({
    xyDirection: EXyDirection.XyDirection,
  });
  const mouseWheelZoomModifier = new MouseWheelZoomModifier({
    xyDirection: EXyDirection.XyDirection,
  });
  const cursorModifier = createCursorModifier();

  (pinchZoomModifier as any).scaleFactor = 0.0005;

  const measurmentModifier = new Measurment();
  measurmentModifier.isEnabled = false;

  const crosshairTool = new CrosshairTool();
  crosshairTool.isEnabled = true;

  sciChartSurface.chartModifiers.add(
    crosshairTool,
    zoomPanModifier,
    pinchZoomModifier,
    mouseWheelZoomModifier,
    measurmentModifier,
    cursorModifier.cursorModifier,
    cursorModifier.rolloverModifier,
    new AnnotationHoverModifier(),
  );

  return {
    crosshairTool,
    zoomPanModifier,
    cursorModifier: cursorModifier.cursorModifier,
    rolloverModifier: cursorModifier.rolloverModifier,
    measurmentModifier,
  };
};
