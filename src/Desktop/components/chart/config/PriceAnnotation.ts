//? this code for dynamic price which move and down 

import { SciChartSurface, HorizontalLineAnnotation } from "scichart";
import { appTheme } from "../../../../Shared/styles/theme";

export const PriceAnnotation = (sciChartSurface: SciChartSurface) => {

  //? can we make it dynamic for another currency?
  const latestPriceAnnotation = new HorizontalLineAnnotation({
    isHidden: true,
    strokeDashArray: [2, 2],
    strokeThickness: 1,
    axisFontSize: 12,
    axisLabelStroke: appTheme.ForegroundColor,
    showLabel: true,
  });
  sciChartSurface.annotations.add(latestPriceAnnotation);

  return { latestPriceAnnotation };
};
