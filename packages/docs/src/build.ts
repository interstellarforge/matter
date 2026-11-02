import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { marked } from "marked";

import { examples } from "./examples.ts";

const repo = (path: string) =>
  fileURLToPath(new URL(`../../../${path}`, import.meta.url));
const dist = fileURLToPath(new URL("../dist/", import.meta.url));

const index = JSON.parse(
  await readFile(repo("packages/tokens/dist/tokens.index.json"), "utf8"),
) as {
  themes: string[];
  densities: string[];
  tokenNames: string[];
};

const escape = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;");

const guides = [
  ["Releasing", "docs/releasing.md"],
  ["Accessibility baseline", "specs/accessibility/baseline.md"],
  ["Keyboard interaction", "specs/interaction/keyboard.md"],
  ["Component conventions", "specs/components/conventions.md"],
  ["Forms", "specs/patterns/forms.md"],
  ["States", "specs/patterns/states.md"],
  ["Search and filter", "specs/patterns/search-filter.md"],
  ["Using Matter in an app (AGENTS.md)", "docs/agents-consumer.md"],
  ["Atlas pilot: migration guide", "docs/pilot-atlas.md"],
] as const;

const slug = (path: string) => path.split("/").pop()?.replace(".md", "") ?? "";

function page(title: string, body: string, root = ""): string {
  const nav = (
    [
      ["Home", "index.html"],
      ["Tokens", "tokens.html"],
      ["Components", "components.html"],
      ["Guides", "guides/index.html"],
    ] as const
  )
    .map(([label, href]) => `<a href="${root}${href}">${label}</a>`)
    .join("");
  const select = (name: string, values: string[]) =>
    `<label>${name}<select class="m-input" data-switch="${name}">${values
      .map((value) => `<option>${value}</option>`)
      .join("")}</select></label>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)} · Matter</title>
<script src="${root}theme-init.js"></script>
<link rel="stylesheet" href="${root}matter.css">
<link rel="stylesheet" href="${root}site.css">
</head>
<body>
<header class="site-header">
<strong>Matter</strong>
<nav>${nav}</nav>
<div class="switchers">${select("theme", index.themes)}${select("color-mode", ["system", "light", "dark"])}${select("density", index.densities)}</div>
</header>
<main>
${body}
</main>
<script src="${root}site.js"></script>
</body>
</html>
`;
}

const siteCss = `@layer matter.base {
  body { margin: 0; background: var(--m-bg); color: var(--m-text); font: var(--m-fs-base)/var(--m-lh-normal) var(--m-font-sans); }
  .site-header { display: flex; flex-wrap: wrap; gap: var(--m-space-4); align-items: center; padding: var(--m-space-3) var(--m-space-5); border-bottom: 1px solid var(--m-border); }
  .site-header nav { display: flex; gap: var(--m-space-3); flex: 1; }
  a { color: var(--m-accent); }
  .switchers { display: flex; gap: var(--m-space-3); font-size: var(--m-fs-sm); color: var(--m-text-muted); }
  .switchers label { display: grid; gap: var(--m-space-1); }
  main { max-width: 64rem; margin: 0 auto; padding: var(--m-space-5); }
  h1, h2, h3 { line-height: var(--m-lh-tight); }
  table { border-collapse: collapse; width: 100%; font-size: var(--m-fs-sm); }
  th, td { border: 1px solid var(--m-border); padding: var(--m-space-2); text-align: left; vertical-align: top; }
  code, pre { font-family: var(--m-font-mono); font-size: var(--m-fs-sm); }
  pre { overflow: auto; padding: var(--m-space-3); background: var(--m-surface-soft); border-radius: var(--m-radius-md); }
  .demo { display: flex; flex-wrap: wrap; gap: var(--m-space-3); align-items: center; padding: var(--m-space-4); border: 1px solid var(--m-border); border-radius: var(--m-radius-md); background: var(--m-surface); }
  .demo .m-input { width: 16rem; }
  .swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr)); gap: var(--m-space-2); }
  .swatch { display: grid; gap: var(--m-space-1); font-size: var(--m-fs-xs); }
  .swatch i { display: block; height: 2.5rem; border: 1px solid var(--m-border); border-radius: var(--m-radius-sm); }
}
`;

const siteJs = `const keys = ["theme", "color-mode", "density"];
for (const select of document.querySelectorAll("[data-switch]")) {
  const key = select.dataset.switch;
  select.value = document.documentElement.getAttribute("data-" + key) ?? (key === "color-mode" ? "system" : select.options[0].value);
  select.addEventListener("change", () => {
    if (select.value === "system") {
      document.documentElement.removeAttribute("data-" + key);
      localStorage.removeItem("matter-" + key);
    } else {
      document.documentElement.setAttribute("data-" + key, select.value);
      localStorage.setItem("matter-" + key, select.value);
    }
  });
}
void keys;
`;

// Tokens: swatches use the live CSS variable, so they follow the theme switchers.
const colorTokens = index.tokenNames.filter((name) =>
  /^(bg|surface|text|border|accent|primary|info|success|warning|danger|focus|overlay|placeholder)/.test(
    name,
  ),
);
const otherTokens = index.tokenNames.filter((n) => !colorTokens.includes(n));
const tokensBody = `<h1>Tokens</h1>
<p>${String(index.tokenNames.length)} tokens, generated from <code>tokens.index.json</code>. Themes: ${index.themes.join(", ")}. Densities: ${index.densities.join(", ")}. Use the switchers above; swatches follow the live CSS variables.</p>
<h2>Colour roles</h2>
<div class="swatches">${colorTokens
  .map(
    (name) =>
      `<div class="swatch"><i style="background:var(--m-${name})"></i><code>--m-${name}</code></div>`,
  )
  .join("")}</div>
<h2>Other tokens</h2>
<p>${otherTokens.map((name) => `<code>--m-${name}</code>`).join(" ")}</p>
<h2>Attributes on <code>&lt;html&gt;</code></h2>
<table><tr><th>Attribute</th><th>Values</th></tr>
<tr><td><code>data-theme</code></td><td>${index.themes.join(", ")}</td></tr>
<tr><td><code>data-color-mode</code></td><td>light, dark (default: OS)</td></tr>
<tr><td><code>data-density</code></td><td>${index.densities.join(", ")}</td></tr></table>`;

// Components: contract table (from specs) + live examples.
const contracts = await readFile(repo("specs/components/contracts.md"), "utf8");
const componentsBody = `<h1>Components</h1>
<p>One shared stylesheet; React and Svelte emit the same markup. The contract is the source of truth.</p>
${examples
  .map(
    (example) => `<section id="${example.component.toLowerCase()}">
<h2>${example.component}</h2>
<div class="demo">${example.html}</div>
<h3>HTML</h3><pre>${escape(example.html)}</pre>
<h3>React</h3><pre>${escape(example.react)}</pre>
<h3>Svelte</h3><pre>${escape(example.svelte)}</pre>
</section>`,
  )
  .join("\n")}
<h2>Contracts</h2>
${await marked.parse(contracts)}`;

const guideBodies = await Promise.all(
  guides.map(async ([title, path]) => ({
    title,
    file: `${slug(path)}.html`,
    html: await marked.parse(await readFile(repo(path), "utf8")),
  })),
);

const homeBody = `<h1>Matter</h1>
<p>Design and experience system of Interstellarforge: tokens, shared CSS, icons, and React and Svelte components.</p>
<ul>
<li><a href="tokens.html">Tokens</a>: colour roles, themes, colour modes, densities.</li>
<li><a href="components.html">Components</a>: examples, React and Svelte usage, contracts.</li>
<li><a href="guides/index.html">Guides</a>: accessibility, keyboard, patterns, releasing, migration.</li>
</ul>
<h2>Quick start</h2>
<pre>${escape(`import "@interstellarforge/matter-css/matter.css";
import { Button } from "@interstellarforge/matter-react"; // or -svelte`)}</pre>`;

await rm(dist, { recursive: true, force: true });
await mkdir(`${dist}guides`, { recursive: true });
await Promise.all([
  cp(repo("packages/css/dist/matter.css"), `${dist}matter.css`),
  cp(repo("packages/css/dist/theme-init.js"), `${dist}theme-init.js`),
  writeFile(`${dist}site.css`, siteCss),
  writeFile(`${dist}site.js`, siteJs),
  writeFile(`${dist}index.html`, page("Home", homeBody)),
  writeFile(`${dist}tokens.html`, page("Tokens", tokensBody)),
  writeFile(`${dist}components.html`, page("Components", componentsBody)),
  writeFile(
    `${dist}guides/index.html`,
    page(
      "Guides",
      `<h1>Guides</h1><ul>${guideBodies
        .map(({ title, file }) => `<li><a href="${file}">${title}</a></li>`)
        .join("")}</ul>`,
      "../",
    ),
  ),
  ...guideBodies.map(({ title, file, html }) =>
    writeFile(`${dist}guides/${file}`, page(title, html, "../")),
  ),
]);
console.log(`docs: ${String(guideBodies.length + 4)} pages`);
