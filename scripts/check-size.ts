import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

/** Size budgets in gzipped bytes; raise only with a ticket (EPIC 11). */
const budgets: [file: string, bytes: number][] = [
  ["../packages/css/dist/matter.css", 6 * 1024],
];

let failed = false;
for (const [file, budget] of budgets) {
  const size = gzipSync(readFileSync(new URL(file, import.meta.url))).length;
  console.log(`${file}: ${String(size)} B gzip (budget ${String(budget)} B)`);
  failed ||= size > budget;
}
process.exit(failed ? 1 : 0);
