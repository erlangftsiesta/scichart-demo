import React from "react";
import { Paper, IconButton, Tooltip, Fade, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface AnnotationPopupProps {
  visible: boolean;
  x: number;
  y: number;
  onDelete: () => void;
}

export const AnnotationPopup: React.FC<AnnotationPopupProps> = ({
  visible,
  x,
  y,
  onDelete,
}) => {
  return (
    <Fade in={visible} timeout={150} unmountOnExit>
      <Paper
        elevation={6}
        sx={{
          position: "absolute",
          left: x,
          top: y,
          transform: "translate(-50%, -100%)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 0.5,
          py: 0.25,
          bgcolor: "#1e222d",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "6px",
          pointerEvents: "auto",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -5,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid rgba(255,255,255,0.12)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Tooltip title="Delete" arrow placement="top">
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                color: "#ef5350",
                p: "4px",
                "&:hover": {
                  bgcolor: "rgba(239,83,80,0.15)",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Fade>
  );
};
