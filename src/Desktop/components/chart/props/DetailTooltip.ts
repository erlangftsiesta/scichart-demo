//? this code for tooltip, it will use on measurement (for detail chart information)

import { appTheme } from "../../../../Shared/styles/theme";
import {
  formatVolume,
  formatDuration,
  formatPrice,
} from "../../../utils/formatters";
import { Stats } from "../utils/ChartStats";

export const getMeasurementTooltip = (
  stats: Stats,
  isBearish: boolean = false,
): string => {
  const absDiff = Math.abs(stats.change);
  const priceDiff = formatPrice(absDiff);
  const percent = Math.abs(stats.changePercent).toFixed(2);
  const bars = stats.count;
  const days = formatDuration(stats.duration);
  const volume = formatVolume(stats.volume);

  const sign = stats.change >= 0 ? "+" : "−";

  const bgColor = isBearish ? appTheme.TV_Red : "#2962FF";

  return `
    <svg width="160" height="70" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="160" height="65" rx="6" fill="${bgColor}" />
      <text x="80" y="20" font-size="12" font-family="Roboto, sans-serif" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${sign}${priceDiff} (${sign}${percent}%)
      </text>
      <text x="80" y="38" font-size="12" font-family="Roboto, sans-serif" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${bars} bar, ${days}
      </text>
      <text x="80" y="56" font-size="12" font-family="Roboto, sans-serif" fill="white" text-anchor="middle" dominant-baseline="middle">
        Vol ${volume}
      </text>
    </svg>
  `;
};
