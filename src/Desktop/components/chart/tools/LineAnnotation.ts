import {
  SciChartSurface,
  AxisBase2D,
  LineAnnotation,
  BoxAnnotation,
  ECoordinateMode,
  EAnnotationLayer,
} from "scichart";
import { appTheme } from "../../../../Shared/styles/theme";
import { calculateCenter } from "../../../utils/calculateCenter";

export const addLineAnnotation = (
  sciChartSurface: SciChartSurface,
  xAxis: AxisBase2D,
) => {
  const xRange = xAxis.visibleRange;
  const yRange = sciChartSurface.yAxes.get(0).visibleRange;

  const { x1, x2, y1, y2 } = calculateCenter(xRange, yRange);

  const lineAnnotation = new LineAnnotation({
    xCoordinateMode: ECoordinateMode.DataValue,
    yCoordinateMode: ECoordinateMode.DataValue,
    stroke: appTheme.MutedBlue,
    strokeThickness: 4,
    x1,
    y1,
    x2,
    y2,
    isEditable: true,
    annotationLayer: EAnnotationLayer.AboveChart,
  });

  lineAnnotation.selectedChanged.subscribe(() => {
    const cb = (sciChartSurface as any).__onAnnotationSelected;
    if (!cb) return;
    if (lineAnnotation.isSelected) {
      const xCalc = sciChartSurface.xAxes
        .get(0)
        .getCurrentCoordinateCalculator();
      const yCalc = sciChartSurface.yAxes
        .get(0)
        .getCurrentCoordinateCalculator();
      const px =
        (xCalc.getCoordinate(lineAnnotation.x1) +
          xCalc.getCoordinate(lineAnnotation.x2)) /
        2;
      const py = Math.min(
        yCalc.getCoordinate(lineAnnotation.y1),
        yCalc.getCoordinate(lineAnnotation.y2),
      );
      cb({ selected: true, pixelX: px, pixelY: py });
    } else {
      cb({ selected: false, pixelX: 0, pixelY: 0 });
    }
  });

  sciChartSurface.annotations.add(lineAnnotation);
};
