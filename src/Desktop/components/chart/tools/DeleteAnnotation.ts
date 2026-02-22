import { SciChartSurface } from "scichart";

export const deleteSelectedAnnotations = (sciChartSurface: SciChartSurface) => {
  const annotations = sciChartSurface.annotations;
  const toRemove: any[] = [];

  for (let i = 0; i < annotations.size(); i++) {
    const annotation = annotations.get(i);
    if (annotation.isSelected) {
      toRemove.push(annotation);
      if ((annotation as any).markers) {
        toRemove.push(...(annotation as any).markers);
      }
    }
  }

  toRemove.forEach((a) => annotations.remove(a));
};
