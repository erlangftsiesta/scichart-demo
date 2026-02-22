import {
  SciChartSurface,
  AxisBase2D,
  BoxAnnotation,
  AxisMarkerAnnotation,
  ECoordinateMode,
  EAnnotationLayer,
} from "scichart";
import { appTheme } from "../../../../Shared/styles/theme";
import { calculateCenter } from "../../../utils/calculateCenter";
import { formatDate, formatPrice } from "../../../utils/formatters";
import {
  createAxisMarker,
  updateXAxisMarker,
  updateYAxisMarker,
} from "../utils/Custom/AxisMarkersCustom";

export const addBoxAnnotation = (
  sciChartSurface: SciChartSurface,
  xAxis: AxisBase2D,
) => {
  const yAxis = sciChartSurface.yAxes.get(0);

  const xRange = xAxis.visibleRange;
  const yRange = yAxis.visibleRange;

  const { x1, x2, y1, y2 } = calculateCenter(xRange, yRange);

  const color = appTheme.VividPurple;

  const boxAnnotation = new BoxAnnotation({
    xCoordinateMode: ECoordinateMode.DataValue,
    yCoordinateMode: ECoordinateMode.DataValue,
    fill: color + "33",
    stroke: color,
    strokeThickness: 1,
    x1,
    y1,
    x2,
    y2,
    isEditable: true,
    annotationLayer: EAnnotationLayer.AboveChart,
  });

  const y1Marker = createAxisMarker(y1, formatPrice, false, "start", color);
  const y2Marker = createAxisMarker(y2, formatPrice, false, "end", color);
  const x1Marker = createAxisMarker(x1, formatDate, true, "start", color);
  const x2Marker = createAxisMarker(x2, formatDate, true, "end", color);

  const updateMarkers = () => {
    updateYAxisMarker(y1Marker, boxAnnotation.y1, formatPrice, color, "start");
    updateYAxisMarker(y2Marker, boxAnnotation.y2, formatPrice, color, "end");
    updateXAxisMarker(x1Marker, boxAnnotation.x1, formatDate, color, "start");
    updateXAxisMarker(x2Marker, boxAnnotation.x2, formatDate, color, "end");
  };

  const onSelected = () => {
    const markers = (boxAnnotation as any).markers as AxisMarkerAnnotation[];
    if (markers) {
      markers.forEach((m) => (m.isHidden = !boxAnnotation.isSelected));
    }
    const cb = (sciChartSurface as any).__onAnnotationSelected;
    if (cb) {
      if (boxAnnotation.isSelected) {
        const xCalc = sciChartSurface.xAxes
          .get(0)
          .getCurrentCoordinateCalculator();
        const yCalc = sciChartSurface.yAxes
          .get(0)
          .getCurrentCoordinateCalculator();
        const px =
          (xCalc.getCoordinate(boxAnnotation.x1) +
            xCalc.getCoordinate(boxAnnotation.x2)) /
          2;
        const py = Math.min(
          yCalc.getCoordinate(boxAnnotation.y1),
          yCalc.getCoordinate(boxAnnotation.y2),
        );
        cb({ selected: true, pixelX: px, pixelY: py });
      } else {
        cb({ selected: false, pixelX: 0, pixelY: 0 });
      }
    }
  };

  boxAnnotation.dragDelta.subscribe(updateMarkers);
  boxAnnotation.selectedChanged.subscribe(onSelected);

  (boxAnnotation as any).markers = [x1Marker, x2Marker, y1Marker, y2Marker];

  sciChartSurface.annotations.add(boxAnnotation);
  sciChartSurface.annotations.add(y1Marker);
  sciChartSurface.annotations.add(y2Marker);
  sciChartSurface.annotations.add(x1Marker);
  sciChartSurface.annotations.add(x2Marker);

  return {
    boxAnnotation,
    markers: {
      y1Marker,
      y2Marker,
      x1Marker,
      x2Marker,
    },
  };
};
