export const PERIODS = [
  { label: "1D", days: 1 },
  { label: "5D", days: 5 },
  { label: "1M", months: 1 },
  { label: "6M", months: 6 },
  { label: "YTD", ytd: true },
  { label: "1Y", years: 1 },
  { label: "5Y", years: 5 },
  { label: "All", all: true },
];

export function useTimeFrameSelector(onPeriodChange: (period: string) => void) {
  const handlePeriodClick = (period: (typeof PERIODS)[0]) => {
    onPeriodChange(period.label);
  };

  return {
    PERIODS,
    handlePeriodClick,
  };
}
