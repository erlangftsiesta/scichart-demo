//? this code for X-Axis and Y-Axis (for some information on)

import {
  DateTimeNumericAxis,
  NumericAxis,
  NumberRange,
  ENumericFormat,
  EAutoRange,
  SciChartSurface,
  TSciChart,
  Thickness,
} from "scichart";
import { appTheme } from "../../../../Shared/styles/theme";

export const configureAxes = (
  sciChartSurface: SciChartSurface,
  wasmContext: TSciChart,
) => {
  sciChartSurface.padding = new Thickness(0, 10, 15, 0);

  const xAxis = new DateTimeNumericAxis(wasmContext, {
    drawMajorGridLines: true,
    drawMinorGridLines: false,
    drawMajorBands: true,
    axisBorder: { border: 0, color: "Transparent" },
    majorGridLineStyle: {
      color: appTheme.TV_Grid,
      strokeThickness: 1,
    },
    labelStyle: {
      color: "#787B86",
      fontSize: 12,
    },
  });
  sciChartSurface.xAxes.add(xAxis);

  const yAxis = new NumericAxis(wasmContext, {
    growBy: new NumberRange(0.1, 0.1),
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 2,
    labelPrefix: "$", // TODO: On Prod ini harus dibuat dynamic
    autoRange: EAutoRange.Always,
    drawMajorGridLines: true,
    drawMinorGridLines: false,
    drawMajorBands: false,
    axisBorder: { border: 0, color: "Transparent" },
    majorGridLineStyle: {
      color: appTheme.TV_Grid,
      strokeThickness: 1,
    },
    labelStyle: {
      color: "#787B86",
      fontSize: 12,
    },
    autoRangeAnimation: {
      duration: 1000,
      animateInitialRanging: false,
      animateSubsequentRanging: true
    },
    allowFastMath: true,
  });
  sciChartSurface.yAxes.add(yAxis);

  return { xAxis, yAxis };
};
