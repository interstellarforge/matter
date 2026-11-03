import { readFileSync } from "node:fs";

/** Packages and the dependencies they must never have (framework independence, ADR-001). */
const rules: Record<string, RegExp> = {
  tokens:
    /^(react|react-dom|next|svelte|@sveltejs\/.+|vue|solid-js|@angular\/.+)$/,
  css: /^(react|react-dom|next|svelte|@sveltejs\/.+|vue|solid-js|@angular\/.+)$/,
  icons:
    /^(react|react-dom|next|svelte|@sveltejs\/.+|vue|solid-js|@angular\/.+)$/,
  payload:
    /^(react|react-dom|next|svelte|@sveltejs\/.+|vue|solid-js|@angular\/.+)$/,
  react: /^(svelte|@sveltejs\/.+|vue|solid-js|@angular\/.+)$/,
  svelte: /^(react|react-dom|next|vue|solid-js|@angular\/.+)$/,
};

type Manifest = Record<
  "dependencies" | "peerDependencies" | "devDependencies",
  Record<string, string> | undefined
>;

const violations = Object.entries(rules).flatMap(([name, forbidden]) => {
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
    .map((dependency) => `matter-${name} must not depend on ${dependency}`);
});

if (violations.length > 0) {
  console.error(violations.join("\n"));
  process.exit(1);
}
console.log(`Dependency rules passed for: ${Object.keys(rules).join(", ")}`);
