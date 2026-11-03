import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { buildPayloadCss } from "./css.ts";

const matterCss = fileURLToPath(
  new URL("../../css/dist/matter.css", import.meta.url),
);
const distDir = fileURLToPath(new URL("../dist/", import.meta.url));

await mkdir(distDir, { recursive: true });
await writeFile(
  `${distDir}matter-payload.css`,
  buildPayloadCss(await readFile(matterCss, "utf8")),
);
