import React from "react";
import { Box, Button } from "@mui/material";
import { appTheme } from "../../../../Shared/styles/theme";
import { useTimeFrameSelector } from "../../../../Shared/hooks/useTimeFrameSelector";

interface TimeFrameSelectorProps {
  onPeriodChange: (period: string) => void;
  selectedPeriod: string;
}

export const TimeFrameSelectorDesktop: React.FC<TimeFrameSelectorProps> = ({
  onPeriodChange,
  selectedPeriod,
}) => {
  const { PERIODS, handlePeriodClick } = useTimeFrameSelector(onPeriodChange);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        backgroundColor: appTheme.Background,
        padding: "4px 8px",
        borderRadius: "4px",
      }}
    >
      {PERIODS.map((period) => (
        <Button
          key={period.label}
          variant="text"
          size="small"
          onClick={() => handlePeriodClick(period)}
          sx={{
            minWidth: "auto",
            padding: "4px 8px",
            color:
              selectedPeriod === period.label
                ? appTheme.VividBlue
                : appTheme.LegendText,
            fontWeight: selectedPeriod === period.label ? "bold" : "normal",
            fontSize: "13px",
            "&:hover": {
              color: appTheme.VividBlue,
              backgroundColor: "rgba(41, 98, 255, 0.08)",
            },
            textTransform: "none",
          }}
        >
          {period.label}
        </Button>
      ))}
    </Box>
  );
};
