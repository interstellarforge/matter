import { readFileSync } from "node:fs";

const frameworkFree = ["tokens", "css"];
const forbidden =
  /^(react|react-dom|next|svelte|@sveltejs\/.+|vue|solid-js|@angular\/.+)$/;

type Manifest = Record<
  "dependencies" | "peerDependencies" | "devDependencies",
  Record<string, string> | undefined
>;

const violations = frameworkFree.flatMap((name) => {
  const manifest = JSON.parse(
    readFileSync(
      new URL(`../packages/${name}/package.json`, import.meta.url),
      "utf8",
    ),
  ) as Manifest;
  const names = [
    manifest.dependencies,
    manifest.peerDependencies,
    manifest.devDependencies,
  ].flatMap((group) => Object.keys(group ?? {}));
  return names
    .filter((dependency) => forbidden.test(dependency))
    .map((dependency) => `matter-${name} depends on ${dependency}`);
});

if (violations.length > 0) {
  console.error(violations.join("\n"));
  process.exit(1);
}
console.log(`Framework-free check passed for: ${frameworkFree.join(", ")}`);
