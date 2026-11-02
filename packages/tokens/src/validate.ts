import { contrastRatio } from "./contrast.ts";
import { type ColorMode, type TokenSet, type TokenValues } from "./tokens.ts";

export interface Finding {
  level: "error" | "warning";
  message: string;
}

interface Pair {
  foreground: string;
  background: string;
  minimum: number;
  level: Finding["level"];
}

const textOn = (
  foreground: string,
  backgrounds: string[],
  minimum = 4.5,
): Pair[] =>
  backgrounds.map((background) => ({
    foreground,
    background,
    minimum,
    level: "error",
  }));

/** WCAG 2.2: 4.5:1 for text (error), 3:1 for UI components and focus (warning until validated per product). */
const pairs: Pair[] = [
  ...textOn("text", ["bg", "surface", "surface-raised", "surface-soft"]),
  ...textOn("text-muted", ["bg", "surface", "surface-raised"]),
  ...textOn("text-subtle", ["bg", "surface"]),
  ...textOn("accent", ["bg", "surface"]),
  ...textOn("accent-on", ["accent"]),
  ...textOn("primary-on", ["primary"]),
  ...textOn("accent-soft-on", ["accent-soft"]),
  ...textOn("danger", ["surface", "danger-soft"]),
  ...textOn("warning", ["surface", "warning-soft"]),
  ...textOn("success", ["surface", "success-soft"]),
  ...textOn("info", ["surface", "info-soft"]),
  ...["bg", "surface"].flatMap((background): Pair[] => [
    { foreground: "focus", background, minimum: 3, level: "warning" },
    { foreground: "border-strong", background, minimum: 3, level: "warning" },
  ]),
  {
    foreground: "placeholder",
    background: "surface",
    minimum: 3,
    level: "warning",
  },
];

function checkMode(
  label: string,
  values: TokenValues,
  reference: string[],
): Finding[] {
  const findings: Finding[] = [];
  const missing = reference.filter((name) => !(name in values));
  const extra = Object.keys(values).filter((name) => !reference.includes(name));
  if (missing.length > 0 || extra.length > 0) {
    findings.push({
      level: "error",
      message: `${label}: token set differs (missing: ${missing.join(", ") || "-"}; extra: ${extra.join(", ") || "-"})`,
    });
  }
  for (const { foreground, background, minimum, level } of pairs) {
    const [fg, bg] = [values[foreground], values[background]];
    if (fg === undefined || bg === undefined) {
      continue;
    }
    const ratio = contrastRatio(fg, bg);
    if (ratio < minimum) {
      findings.push({
        level,
        message: `${label}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1 (needs ${String(minimum)}:1)`,
      });
    }
  }
  return findings;
}

/** Every theme/mode must define the same semantic tokens and meet the contrast pairs. */
export function validate(set: TokenSet): Finding[] {
  const [first] = set.themes;
  const reference = Object.keys(first?.modes.dark ?? first?.modes.light ?? {});
  return set.themes.flatMap((theme) =>
    (Object.entries(theme.modes) as [ColorMode, TokenValues][]).flatMap(
      ([mode, values]) => checkMode(`${theme.name}/${mode}`, values, reference),
    ),
  );
}
