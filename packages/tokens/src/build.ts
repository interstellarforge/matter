import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { buildCss } from "./css.ts";
import { buildIndex } from "./index-files.ts";
import { loadTokens } from "./tokens.ts";
import { validate } from "./validate.ts";

const distDir = fileURLToPath(new URL("../dist/", import.meta.url));

const set = await loadTokens();
const findings = validate(set);
for (const { level, message } of findings) {
  console[level === "error" ? "error" : "warn"](`${level}: ${message}`);
}
if (findings.some(({ level }) => level === "error")) {
  process.exit(1);
}

const index = buildIndex(set);
await mkdir(distDir, { recursive: true });
await Promise.all([
  writeFile(`${distDir}matter-tokens.css`, buildCss(set)),
  writeFile(`${distDir}index.js`, index.js),
  writeFile(`${distDir}index.d.ts`, index.dts),
  writeFile(`${distDir}tokens.index.json`, index.json),
]);
