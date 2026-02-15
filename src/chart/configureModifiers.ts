import {
  SciChartSurface,
  ZoomExtentsModifier,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  CursorModifier,
  AnnotationHoverModifier,
} from "scichart";
import { appTheme } from "../theme";
import { RightClickSelectionModifier } from "./RightClickSelectionModifier";

export const configureModifiers = (sciChartSurface: SciChartSurface) => {
  const cursorModifier = new CursorModifier({
    crosshairStroke: appTheme.TV_Cursor,
    crosshairStrokeDashArray: [2, 2],
    axisLabelFill: appTheme.TV_Cursor,
  });

  sciChartSurface.chartModifiers.add(
    new ZoomExtentsModifier(),
    new ZoomPanModifier({ enableZoom: true }),
    new MouseWheelZoomModifier(),
    new RightClickSelectionModifier(),
    new AnnotationHoverModifier(),
    cursorModifier,
  );

  return { cursorModifier };
};
