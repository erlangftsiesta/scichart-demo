import {
  ChartModifierBase2D,
  ModifierMouseArgs,
  ECoordinateMode,
  EAnnotationLayer,
  CustomAnnotation,
  EHorizontalAnchorPoint,
  EVerticalAnchorPoint,
  LineAnnotation,
  AxisMarkerAnnotation,
  OhlcDataSeries,
} from "scichart";
import { formatDate, formatPrice } from "../../../utils/formatters";

const CROSSHAIR_COLOR = "#9B9B9B";
const LABEL_BG = "#2B2B43";
const LABEL_FG = "#FFFFFF";

export class CrosshairTool extends ChartModifierBase2D {
  public type = "CrosshairTool";

  private hLine: LineAnnotation | undefined;
  private vLine: LineAnnotation | undefined;
  private xMarker: AxisMarkerAnnotation | undefined;
  private yMarker: AxisMarkerAnnotation | undefined;
  private coordLabel: CustomAnnotation | undefined;

  // Cache xValues agar tidak re-fetch tiap mousemove
  private cachedXValues: number[] | undefined;
  private cachedDataCount: number = 0;

  constructor() {
    super();
  }

  // ── Ambil xValues dari OhlcDataSeries SciChart ──────────────────────────────
  private getXValues(): number[] {
    try {
      const series = this.parentSurface.renderableSeries.get(0);
      if (!series) return [];

      const ds = series.dataSeries as OhlcDataSeries;
      if (!ds) return [];

      const count = ds.count();

      // Pakai cache kalau data belum berubah
      if (this.cachedXValues && this.cachedDataCount === count) {
        return this.cachedXValues;
      }

      // OhlcDataSeries SciChart: xValues adalah SCRTDoubleVector
      const nativeX = (ds as any).xValues;

      let arr: number[] = [];

      if (nativeX && typeof nativeX.get === "function") {
        // SCRTDoubleVector — akses via .get(i)
        arr = Array.from({ length: count }, (_, i) => nativeX.get(i));
      } else if (nativeX && typeof nativeX.toArray === "function") {
        arr = nativeX.toArray();
      } else if (Array.isArray(nativeX)) {
        arr = nativeX;
      } else {
        // Fallback: getNativeXValues
        const native = (ds as any).getNativeXValues?.();
        if (native && typeof native.get === "function") {
          arr = Array.from({ length: count }, (_, i) => native.get(i));
        }
      }

      this.cachedXValues = arr;
      this.cachedDataCount = count;
      return arr;
    } catch (e) {
      console.warn("[CrosshairTool] getXValues error:", e);
      return [];
    }
  }

  // ── Binary search snap ke bar terdekat ──────────────────────────────────────
  private snapToNearestBar(xVal: number): number {
    const xValues = this.getXValues();
    if (!xValues.length) return xVal;

    let lo = 0;
    let hi = xValues.length - 1;

    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (xValues[mid] < xVal) lo = mid + 1;
      else hi = mid;
    }

    if (lo > 0) {
      const distPrev = Math.abs(xValues[lo - 1] - xVal);
      const distCurr = Math.abs(xValues[lo] - xVal);
      return distPrev <= distCurr ? xValues[lo - 1] : xValues[lo];
    }

    return xValues[lo];
  }

  public modifierMouseMove(args: ModifierMouseArgs): void {
    super.modifierMouseMove(args);
    if (!this.isEnabled) return;

    const px = args.mousePoint.x;
    const py = args.mousePoint.y;
    const rect = this.parentSurface.seriesViewRect;

    if (
      px < rect.left ||
      px > rect.right ||
      py < rect.top ||
      py > rect.bottom
    ) {
      this.hideCrosshair();
      return;
    }

    this.showCrosshair();

    const xCalc = this.parentSurface.xAxes
      .get(0)
      .getCurrentCoordinateCalculator();
    const yCalc = this.parentSurface.yAxes
      .get(0)
      .getCurrentCoordinateCalculator();

    const xValRaw = xCalc.getDataValue(px);
    const yVal = yCalc.getDataValue(py);

    // Snap ke bar terdekat
    const xValSnapped = this.snapToNearestBar(xValRaw);
    const pxSnapped = xCalc.getCoordinate(xValSnapped);

    // ── Horizontal line ──────────────────────────────────────────────────────
    if (!this.hLine) {
      this.hLine = new LineAnnotation({
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        stroke: CROSSHAIR_COLOR,
        strokeThickness: 1,
        strokeDashArray: [4, 4],
        annotationLayer: EAnnotationLayer.AboveChart,
        x1: rect.left,
        x2: rect.right,
        y1: py,
        y2: py,
        isEditable: false,
      });
      this.parentSurface.annotations.add(this.hLine);
    } else {
      this.hLine.y1 = py;
      this.hLine.y2 = py;
      this.hLine.x1 = rect.left;
      this.hLine.x2 = rect.right;
    }

    // ── Vertical line — pakai pxSnapped, bukan px ────────────────────────────
    if (!this.vLine) {
      this.vLine = new LineAnnotation({
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        stroke: CROSSHAIR_COLOR,
        strokeThickness: 1,
        strokeDashArray: [4, 4],
        annotationLayer: EAnnotationLayer.AboveChart,
        x1: pxSnapped,
        x2: pxSnapped,
        y1: rect.top,
        y2: rect.bottom,
        isEditable: false,
      });
      this.parentSurface.annotations.add(this.vLine);
    } else {
      this.vLine.x1 = pxSnapped;
      this.vLine.x2 = pxSnapped;
      this.vLine.y1 = rect.top;
      this.vLine.y2 = rect.bottom;
    }

    // ── X axis marker ────────────────────────────────────────────────────────
    if (!this.xMarker) {
      this.xMarker = new AxisMarkerAnnotation({
        fontSize: 11,
        fontStyle: "Bold",
        backgroundColor: LABEL_BG,
        color: LABEL_FG,
        formattedValue: formatDate(xValSnapped),
        xAxisId: "AxisX",
        x1: xValSnapped,
        isEditable: false,
      });
      this.parentSurface.annotations.add(this.xMarker);
    } else {
      this.xMarker.x1 = xValSnapped;
      this.xMarker.formattedValue = formatDate(xValSnapped);
    }

    // ── Y axis marker ────────────────────────────────────────────────────────
    if (!this.yMarker) {
      this.yMarker = new AxisMarkerAnnotation({
        fontSize: 11,
        fontStyle: "Bold",
        backgroundColor: LABEL_BG,
        color: LABEL_FG,
        formattedValue: formatPrice(yVal),
        yAxisId: "AxisY",
        y1: yVal,
        isEditable: false,
      });
      this.parentSurface.annotations.add(this.yMarker);
    } else {
      this.yMarker.y1 = yVal;
      this.yMarker.formattedValue = formatPrice(yVal);
    }

    // ── Floating coord label ─────────────────────────────────────────────────
    const labelSvg = this.makeCoordLabel(
      formatPrice(yVal),
      formatDate(xValSnapped),
    );

    if (!this.coordLabel) {
      this.coordLabel = new CustomAnnotation({
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        x1: pxSnapped + 12,
        y1: py - 8,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        svgString: labelSvg,
        annotationLayer: EAnnotationLayer.AboveChart,
        isEditable: false,
      });
      this.parentSurface.annotations.add(this.coordLabel);
    } else {
      this.coordLabel.x1 = pxSnapped + 12;
      this.coordLabel.y1 = py - 8;
      this.coordLabel.svgString = labelSvg;
    }
  }

  public modifierMouseLeave(args: ModifierMouseArgs): void {
    super.modifierMouseLeave(args);
    this.hideCrosshair();
  }

  public invalidateCache(): void {
    this.cachedXValues = undefined;
    this.cachedDataCount = 0;
  }

  private showCrosshair() {
    [
      this.hLine,
      this.vLine,
      this.xMarker,
      this.yMarker,
      this.coordLabel,
    ].forEach((a) => {
      if (a) a.isHidden = false;
    });
  }

  private hideCrosshair() {
    [
      this.hLine,
      this.vLine,
      this.xMarker,
      this.yMarker,
      this.coordLabel,
    ].forEach((a) => {
      if (a) a.isHidden = true;
    });
  }

  private makeCoordLabel(price: string, date: string): string {
    const w = 130,
      h = 36,
      r = 5;
    return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}"
        fill="${LABEL_BG}" fill-opacity="0.92" stroke="${CROSSHAIR_COLOR}" stroke-width="0.5"/>
      <text x="10" y="13" font-size="11" font-family="Inter,Roboto,sans-serif"
        font-weight="700" fill="${LABEL_FG}" dominant-baseline="middle">${price}</text>
      <text x="10" y="27" font-size="10" font-family="Inter,Roboto,sans-serif"
        fill="#9B9B9B" dominant-baseline="middle">${date}</text>
    </svg>`;
  }

  public onDetach(): void {
    this.removeAnnotations();
    super.onDetach();
  }

  private removeAnnotations() {
    [
      this.hLine,
      this.vLine,
      this.xMarker,
      this.yMarker,
      this.coordLabel,
    ].forEach((a) => {
      if (a) {
        try {
          this.parentSurface.annotations.remove(a);
        } catch (_) {}
      }
    });
    this.hLine = undefined;
    this.vLine = undefined;
    this.xMarker = undefined;
    this.yMarker = undefined;
    this.coordLabel = undefined;
    this.invalidateCache();
  }
}
