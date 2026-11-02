import { readdirSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

/** Size budgets in gzipped bytes; raise only with a ticket (EPIC 11). */
const cssBudget = 6 * 1024;
/** Per component module (largest today: Menu, 1.3 KiB). */
const componentBudget = 2 * 1024;

const gzipSize = (url: URL) => gzipSync(readFileSync(url)).length;

const budgets: [label: string, bytes: number, budget: number][] = [
  [
    "css/matter.css",
    gzipSize(new URL("../packages/css/dist/matter.css", import.meta.url)),
    cssBudget,
  ],
];

for (const [pkg, extension] of [
  ["react", ".js"],
  ["svelte", ".svelte"],
] as const) {
  const dist = new URL(`../packages/${pkg}/dist/`, import.meta.url);
  for (const name of readdirSync(dist)) {
    if (name.endsWith(extension) && name !== "index.js") {
      budgets.push([
        `${pkg}/${name}`,
        gzipSize(new URL(name, dist)),
        componentBudget,
      ]);
    }
  }
}

let failed = false;
for (const [label, size, budget] of budgets) {
  const over = size > budget;
  failed ||= over;
  console.log(
    `${over ? "FAIL" : "ok  "} ${label}: ${String(size)} B gzip (budget ${String(budget)} B)`,
  );
}
process.exit(failed ? 1 : 0);
