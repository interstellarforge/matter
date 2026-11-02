import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { themeInitScript } from "./theme-init.ts";

const distDir = fileURLToPath(new URL("../dist/", import.meta.url));
const tokensCss = fileURLToPath(
  new URL("../../tokens/dist/matter-tokens.css", import.meta.url),
);

await mkdir(distDir, { recursive: true });
await Promise.all([
  copyFile(tokensCss, `${distDir}matter.css`),
  writeFile(
    `${distDir}index.js`,
    `export const themeInitScript = ${JSON.stringify(themeInitScript)};\n`,
  ),
  writeFile(
    `${distDir}index.d.ts`,
    "export declare const themeInitScript: string;\n",
  ),
]);
