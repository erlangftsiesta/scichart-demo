import {
  ChartModifierBase2D,
  ModifierMouseArgs,
  Point,
  EExecuteOn,
  BoxAnnotation,
  ECoordinateMode,
  EAnnotationLayer,
  CustomAnnotation,
  OhlcDataSeries,
  EHorizontalAnchorPoint,
  EVerticalAnchorPoint,
} from "scichart";
import { appTheme } from "../theme";

export class RightClickSelectionModifier extends ChartModifierBase2D {
  public type = "RightClickSelectionModifier";
  private startPoint: Point | undefined;
  private activeBox: BoxAnnotation | undefined;
  private statsTooltip: CustomAnnotation | undefined;

  constructor() {
    super();
  }

  public modifierMouseDown(args: ModifierMouseArgs): void {
    super.modifierMouseDown(args);

    if (args.button === EExecuteOn.MouseRightButton) {
      this.startPoint = args.mousePoint;
      this.clearSelection();

      // Create a new BoxAnnotation
      this.activeBox = new BoxAnnotation({
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        fill: appTheme.VividSkyBlue + "33", // Translucent blue
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 1,
        x1: this.startPoint.x,
        y1: this.startPoint.y,
        x2: this.startPoint.x,
        y2: this.startPoint.y,
        annotationLayer: EAnnotationLayer.AboveChart,
      });

      this.parentSurface.annotations.add(this.activeBox);
    }
  }

  public modifierMouseMove(args: ModifierMouseArgs): void {
    super.modifierMouseMove(args);

    if (this.startPoint && this.activeBox) {
      this.activeBox.x2 = args.mousePoint.x;
      this.activeBox.y2 = args.mousePoint.y;
    }

    // Handle Tooltip Hover Logic here for smoothness
    if (!this.startPoint && this.activeBox) {
      // Check if mouse is over the box
      const xCalc = this.parentSurface.xAxes
        .get(0)
        .getCurrentCoordinateCalculator();
      const yCalc = this.parentSurface.yAxes
        .get(0)
        .getCurrentCoordinateCalculator();

      const x1Pix = xCalc.getCoordinate(this.activeBox.x1);
      const x2Pix = xCalc.getCoordinate(this.activeBox.x2);
      const y1Pix = yCalc.getCoordinate(this.activeBox.y1);
      const y2Pix = yCalc.getCoordinate(this.activeBox.y2);

      const minX = Math.min(x1Pix, x2Pix);
      const maxX = Math.max(x1Pix, x2Pix);
      const minY = Math.min(y1Pix, y2Pix);
      const maxY = Math.max(y1Pix, y2Pix);

      const mx = args.mousePoint.x;
      const my = args.mousePoint.y;

      if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
        // Mouse is over the box
        this.updateTooltip(
          this.activeBox.x1,
          this.activeBox.x2,
          this.activeBox.y1,
          this.activeBox.y2,
          mx,
          my,
        );
      } else {
        // Mouse is outside
        if (this.statsTooltip) {
          this.parentSurface.annotations.remove(this.statsTooltip);
          this.statsTooltip = undefined;
        }
      }
    }
  }

  public modifierMouseUp(args: ModifierMouseArgs): void {
    super.modifierMouseUp(args);

    if (this.startPoint && this.activeBox) {
      // Check for minimum drag distance to prevent accidental clicks
      const dist = Math.sqrt(
        Math.pow(args.mousePoint.x - this.startPoint.x, 2) +
          Math.pow(args.mousePoint.y - this.startPoint.y, 2),
      );

      if (dist < 5) {
        this.clearSelection();
        this.startPoint = undefined;
        return;
      }

      // Finalize the box - convert to data coordinates for persistence
      const xCalc = this.parentSurface.xAxes
        .get(0)
        .getCurrentCoordinateCalculator();
      const yCalc = this.parentSurface.yAxes
        .get(0)
        .getCurrentCoordinateCalculator();

      const x1Data = xCalc.getDataValue(this.activeBox.x1);
      const x2Data = xCalc.getDataValue(this.activeBox.x2);
      const y1Data = yCalc.getDataValue(this.activeBox.y1);
      const y2Data = yCalc.getDataValue(this.activeBox.y2);

      // Remove the pixel-based box
      this.parentSurface.annotations.remove(this.activeBox);

      // Create a new data-based box
      this.activeBox = new BoxAnnotation({
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        fill: appTheme.VividSkyBlue + "33",
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 1,
        x1: x1Data,
        x2: x2Data,
        y1: y1Data,
        y2: y2Data,
        isEditable: false,
        // onHover removed to use modifierMouseMove for better performance
      });

      this.parentSurface.annotations.add(this.activeBox);
      this.startPoint = undefined;
    }
  }

  private clearSelection() {
    if (this.activeBox) {
      this.parentSurface.annotations.remove(this.activeBox);
      this.activeBox = undefined;
    }
    if (this.statsTooltip) {
      this.parentSurface.annotations.remove(this.statsTooltip);
      this.statsTooltip = undefined;
    }
  }

  private updateTooltip(
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    mouseX: number,
    mouseY: number,
  ) {
    if (!this.statsTooltip) {
      const stats = this.calculateStats(Math.min(x1, x2), Math.max(x1, x2));
      if (!stats) return;

      this.statsTooltip = new CustomAnnotation({
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        x1: mouseX,
        y1: mouseY,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        svgString: `<svg width="220" height="130" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="100%" height="100%" fill="#141821" stroke="#444" rx="6" ry="6" fill-opacity="0.95"/>
                
                <text x="10" y="20" fill="#e1e4e8" font-size="11" font-family="Inter, system-ui, sans-serif" font-weight="bold">Range: ${stats.minLow.toFixed(
                  2,
                )} — ${stats.maxHigh.toFixed(2)}</text>
                
                <text x="10" y="40" fill="#e1e4e8" font-size="11" font-family="Inter, system-ui, sans-serif">Avg: ${stats.avg.toFixed(
                  2,
                )}</text>
                
                <text x="10" y="60" fill="${
                  stats.change >= 0 ? appTheme.TV_Green : appTheme.TV_Red
                }" font-size="11" font-family="Inter, system-ui, sans-serif">Change: ${stats.change.toFixed(
                  2,
                )} (${stats.changePercent.toFixed(2)}%)</text>
                
                <text x="10" y="80" fill="#e1e4e8" font-size="11" font-family="Inter, system-ui, sans-serif">Bars: ${
                  stats.count
                } | Vol: ${this.formatVolume(stats.volume)}</text>
                
                <text x="10" y="100" fill="#e1e4e8" font-size="11" font-family="Inter, system-ui, sans-serif">Time: ${this.formatDuration(
                  stats.duration,
                )}</text>
            </svg>`,
      });
      this.parentSurface.annotations.add(this.statsTooltip);
    } else {
      this.statsTooltip.x1 = mouseX;
      this.statsTooltip.y1 = mouseY;
    }
  }

  private calculateStats(xMin: number, xMax: number) {
    const renderableSeries = this.parentSurface.renderableSeries.get(0);
    if (!renderableSeries || !renderableSeries.dataSeries) return null;

    const dataSeries = renderableSeries.dataSeries as OhlcDataSeries;
    const xValues = dataSeries.getNativeXValues();
    const openValues = dataSeries.getNativeOpenValues();
    const highValues = dataSeries.getNativeHighValues();
    const lowValues = dataSeries.getNativeLowValues();
    const closeValues = dataSeries.getNativeCloseValues();

    let startPrice = 0;
    let endPrice = 0;
    let maxHigh = Number.MIN_VALUE;
    let minLow = Number.MAX_VALUE;
    let volumeSum = 0;
    let count = 0;
    let startTime = 0;
    let endTime = 0;
    let sumClose = 0;
    let foundStart = false;

    for (let i = 0; i < dataSeries.count(); i++) {
      const x = xValues.get(i);
      if (x >= xMin && x <= xMax) {
        if (!foundStart) {
          startPrice = openValues.get(i);
          startTime = x;
          foundStart = true;
        }
        endPrice = closeValues.get(i);
        endTime = x;
        maxHigh = Math.max(maxHigh, highValues.get(i));
        minLow = Math.min(minLow, lowValues.get(i));

        const metadata = dataSeries.getMetadataAt(i) as { volume?: number };
        if (metadata && typeof metadata.volume === "number") {
          volumeSum += metadata.volume;
        }

        sumClose += closeValues.get(i);
        count++;
      }
    }

    if (!foundStart) return null;

    const change = endPrice - startPrice;
    const changePercent = (change / startPrice) * 100;
    const avg = sumClose / count;
    const duration = (endTime - startTime) * 1000;

    return {
      startPrice,
      endPrice,
      change,
      changePercent,
      maxHigh,
      minLow,
      avg,
      count,
      volume: volumeSum,
      duration,
    };
  }

  private formatVolume(vol: number): string {
    if (vol >= 1e9) return (vol / 1e9).toFixed(2) + "B";
    if (vol >= 1e6) return (vol / 1e6).toFixed(2) + "M";
    if (vol >= 1e3) return (vol / 1e3).toFixed(2) + "K";
    return vol.toFixed(0);
  }

  private formatDuration(ms: number): string {
    if (ms >= 86400000) return (ms / 86400000).toFixed(1) + "d";
    if (ms >= 3600000) return (ms / 3600000).toFixed(1) + "h";
    return (ms / 60000).toFixed(0) + "m";
  }
}
