export const themes = [
  { id: "grape", label: "Grape", swatch: "oklch(0.5 0.2 300)" },
  { id: "berry", label: "Berry", swatch: "oklch(0.55 0.2 15)" },
  { id: "ocean", label: "Ocean", swatch: "oklch(0.52 0.16 245)" },
  { id: "forest", label: "Forest", swatch: "oklch(0.5 0.13 160)" },
  { id: "midnight", label: "Midnight", swatch: "oklch(0.3 0.08 270)" },
] as const;

export type ThemeId = (typeof themes)[number]["id"];
