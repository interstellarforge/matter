import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { themeInitScript } from "./theme-init.ts";

const distDir = fileURLToPath(new URL("../dist/", import.meta.url));
const tokensCss = fileURLToPath(
  new URL("../../tokens/dist/matter-tokens.css", import.meta.url),
);
const componentsCss = fileURLToPath(
  new URL("./components.css", import.meta.url),
);

const [tokens, components] = await Promise.all([
  readFile(tokensCss, "utf8"),
  readFile(componentsCss, "utf8"),
]);

await mkdir(distDir, { recursive: true });
await Promise.all([
  writeFile(`${distDir}matter.css`, `${tokens}${components}`),
  writeFile(
    `${distDir}index.js`,
    `export const themeInitScript = ${JSON.stringify(themeInitScript)};\n`,
  ),
  writeFile(
    `${distDir}index.d.ts`,
    "export declare const themeInitScript: string;\n",
  ),
]);
