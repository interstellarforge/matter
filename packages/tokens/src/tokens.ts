import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import StyleDictionary from "style-dictionary";

export type ColorMode = "light" | "dark";
export type TokenValues = Record<string, string>;
export interface ThemeTokens {
  name: string;
  /** Theme-level tokens, identical in every colour mode. */
  base: TokenValues;
  modes: Partial<Record<ColorMode, TokenValues>>;
}
export interface TokenSet {
  core: TokenValues;
  themes: ThemeTokens[];
  densities: Record<string, TokenValues>;
}

const tokensDir = fileURLToPath(new URL("../tokens/", import.meta.url));
const colorModes: readonly ColorMode[] = ["light", "dark"];

export const defaultTheme = "deep-space";
export const defaultDensity = "comfortable";
export const cssPrefix = "m";

function toName(path: string[]): string {
  return (path[0] === "color" ? path.slice(1) : path).join("-");
}

function toValue(raw: unknown): string {
  if (Array.isArray(raw)) {
    return `cubic-bezier(${raw.join(", ")})`;
  }
  if (typeof raw === "string" || typeof raw === "number") {
    return String(raw);
  }
  throw new Error(`Unsupported token value: ${JSON.stringify(raw)}`);
}

/** Resolves references across `sources` and returns only the tokens defined in `own`. */
async function resolve(sources: string[], own: string): Promise<TokenValues> {
  const dictionary = new StyleDictionary({
    source: sources,
    log: { warnings: "error", verbosity: "silent" },
    platforms: { css: { transformGroup: "css" } },
  });
  const { allTokens } = await dictionary.getPlatformTokens("css");
  const entries = allTokens
    .filter((token) => token.filePath === own)
    .map((token): [string, string] => [
      toName(token.path),
      toValue(token.$value),
    ])
    .sort(([a], [b]) => a.localeCompare(b));
  return Object.fromEntries(entries);
}

async function names(directory: string): Promise<string[]> {
  return (await readdir(`${tokensDir}${directory}`)).sort();
}

export async function loadTokens(): Promise<TokenSet> {
  const core = `${tokensDir}core.json`;
  const themes: ThemeTokens[] = [];
  for (const name of await names("themes")) {
    const dir = `${tokensDir}themes/${name}/`;
    const themeFile = `${dir}theme.json`;
    const modes: ThemeTokens["modes"] = {};
    for (const mode of colorModes) {
      if ((await names(`themes/${name}`)).includes(`${mode}.json`)) {
        modes[mode] = await resolve(
          [core, themeFile, `${dir}${mode}.json`],
          `${dir}${mode}.json`,
        );
      }
    }
    themes.push({
      name,
      base: await resolve([core, themeFile], themeFile),
      modes,
    });
  }
  const densities: TokenSet["densities"] = {};
  for (const file of await names("density")) {
    const path = `${tokensDir}density/${file}`;
    densities[file.replace(".json", "")] = await resolve([core, path], path);
  }
  return { core: await resolve([core], core), themes, densities };
}
