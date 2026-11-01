/**
 * WebGL cannot read CSS oklch tokens, so the 3D scenes use these hex mirrors of
 * the design tokens in src/styles.css. Keep both in sync.
 */
export const scenePalette = {
  ink: "#171411",
  paper: "#F4F0E8",
  ember: "#FF8A45",
  rust: "#B84A12",
  oxide: "#8E3515",
} as const;
