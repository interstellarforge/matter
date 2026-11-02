import {
  cssPrefix,
  defaultDensity,
  defaultTheme,
  type TokenSet,
} from "./tokens.ts";

const list = (values: string[]): string =>
  values.map((value) => `'${value}'`).join(" | ");
const array = (values: string[]): string =>
  `[${values.map((value) => `'${value}'`).join(", ")}]`;

/** Machine-readable index of what the package offers (also for AI agents). */
export function buildIndex(set: TokenSet): {
  js: string;
  dts: string;
  json: string;
} {
  const themes = set.themes.map(({ name }) => name);
  const densities = Object.keys(set.densities);
  const colorModes = ["light", "dark"];
  const tokenNames = [
    ...new Set([
      ...Object.keys(set.core),
      ...set.themes.flatMap(({ base, modes }) => [
        ...Object.keys(base),
        ...Object.values(modes).flatMap(Object.keys),
      ]),
      ...Object.values(set.densities).flatMap(Object.keys),
    ]),
  ].sort();
  const modesByTheme = Object.fromEntries(
    set.themes.map(({ name, modes }) => [name, Object.keys(modes)]),
  );
  return {
    js: `export const themes = ${array(themes)};\nexport const colorModes = ${array(colorModes)};\nexport const densities = ${array(densities)};\nexport const defaultTheme = '${defaultTheme}';\nexport const defaultDensity = '${defaultDensity}';\nexport const modesByTheme = ${JSON.stringify(modesByTheme)};\nexport const tokenNames = ${array(tokenNames)};\nexport const cssVar = (name) => \`var(--${cssPrefix}-\${name})\`;\n`,
    dts: `export type ThemeName = ${list(themes)};\nexport type ColorMode = ${list(colorModes)};\nexport type Density = ${list(densities)};\nexport type TokenName = ${list(tokenNames)};\nexport declare const themes: readonly ThemeName[];\nexport declare const colorModes: readonly ColorMode[];\nexport declare const densities: readonly Density[];\nexport declare const defaultTheme: ThemeName;\nexport declare const defaultDensity: Density;\nexport declare const modesByTheme: Readonly<Record<ThemeName, readonly ColorMode[]>>;\nexport declare const tokenNames: readonly TokenName[];\nexport declare function cssVar(name: TokenName): string;\n`,
    json: `${JSON.stringify({ prefix: cssPrefix, themes, modesByTheme, densities, defaultTheme, defaultDensity, tokenNames }, undefined, 2)}\n`,
  };
}
