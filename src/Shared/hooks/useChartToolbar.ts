import React from "react";

export function useChartToolbar(onToolChange: (tool: string) => void) {
  const handleFormat = (
    _event: React.MouseEvent<HTMLElement>,
    newFormat: string | null,
  ) => {
    if (newFormat !== null) {
      onToolChange(newFormat);
    }
  };

  return {
    handleFormat,
  };
}
