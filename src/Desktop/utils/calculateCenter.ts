import { NumberRange } from "scichart";

export const calculateCenter = (xRange: NumberRange, yRange: NumberRange) => {
  const x1 = (xRange.max + xRange.min) / 2 - (xRange.max - xRange.min) * 0.1;
  const x2 = (xRange.max + xRange.min) / 2 + (xRange.max - xRange.min) * 0.1;
  const y1 = (yRange.max + yRange.min) / 2 - (yRange.max - yRange.min) * 0.1;
  const y2 = (yRange.max + yRange.min) / 2 + (yRange.max - yRange.min) * 0.1;

  return { x1, x2, y1, y2 };
};
