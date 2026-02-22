//? this code for control our components, if we dont wanna use it, dont regist it at the switch case code!

import { NumberRange, AxisBase2D, ChartModifierBase2D } from "scichart";

export const setXRange = (
  xAxis: AxisBase2D,
  startDate: Date,
  endDate: Date,
) => {
  console.log(
    `createCandlestickChart(): Setting chart range to ${startDate} - ${endDate}`,
  );
  xAxis.visibleRange = new NumberRange(
    startDate.getTime() / 1000,
    endDate.getTime() / 1000,
  );
};

export const setTool = (
  modifiers: { [key: string]: ChartModifierBase2D },
  tool: string,
) => {
  const { crosshairTool, zoomPanModifier, measurmentModifier } = modifiers;

  if (crosshairTool) crosshairTool.isEnabled = false;
  zoomPanModifier.isEnabled = false;
  measurmentModifier.isEnabled = false;

  switch (tool) {
    case "crosshair":
      zoomPanModifier.isEnabled = true;
      crosshairTool.isEnabled = true;
      break;
    case "pan":
      zoomPanModifier.isEnabled = true;
      break;
    case "measurement":
      measurmentModifier.isEnabled = true;
      zoomPanModifier.isEnabled = true;
      break;
    default:
      zoomPanModifier.isEnabled = true;
      if (crosshairTool) crosshairTool.isEnabled = true;
      break;
  }
};
