/**
 * Callback fired when an annotation is selected/deselected.
 * pixelX/pixelY are the screen-space coordinates of the selection point (top-center of annotation).
 */
export type AnnotationSelectionCallback = (event: {
  selected: boolean;
  pixelX: number;
  pixelY: number;
}) => void;
