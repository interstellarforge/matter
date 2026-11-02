const hexPattern = /^#(?<hex>[0-9a-f]{6})$/i;

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const match = hexPattern.exec(hex)?.groups?.["hex"];
  if (match === undefined) {
    throw new Error(`Not a #rrggbb colour: ${hex}`);
  }
  const [r, g, b] = [0, 2, 4].map((i) =>
    channel(parseInt(match.slice(i, i + 2), 16)),
  );
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

/** WCAG 2.x contrast ratio between two #rrggbb colours. */
export function contrastRatio(foreground: string, background: string): number {
  const [light, dark] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
}
