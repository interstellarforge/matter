import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { marked } from "marked";

import { type ComponentDoc, components } from "./content.ts";

const repo = (path: string) =>
  fileURLToPath(new URL(`../../../${path}`, import.meta.url));
const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const here = (path: string) =>
  readFile(fileURLToPath(new URL(path, import.meta.url)), "utf8");

const index = JSON.parse(
  await readFile(repo("packages/tokens/dist/tokens.index.json"), "utf8"),
) as { themes: string[]; densities: string[]; tokenNames: string[] };

const escape = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const inline = (text: string) =>
  escape(text).replaceAll(/`([^`]+)`/g, "<code>$1</code>");
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replaceAll(/<[^>]+>/g, "")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");

interface Page {
  path: string;
  title: string;
  section: string;
  group: string;
  lead?: string;
  body: string;
  toc: [id: string, text: string][];
  search: string;
}

const pages: Page[] = [];

const guideTitles: Record<string, string> = {
  "foundations/accessibility": "Accessibility",
  "foundations/keyboard": "Keyboard interaction",
  "patterns/forms": "Forms and validation",
  "patterns/states": "Loading, empty and error",
  "patterns/search-and-filter": "Search and filter",
  "resources/component-conventions": "Component conventions",
  "resources/releasing": "Releasing",
  "resources/payload-adapter": "Payload admin theme",
  "resources/ai-agents": "Using Matter with AI agents",
  "resources/atlas-pilot": "Case study: Atlas migration",
};

// Markdown guides: [section, group, title override, source]
const guideSources = [
  [
    "Foundations",
    "Foundations",
    "foundations/accessibility",
    "specs/accessibility/baseline.md",
  ],
  [
    "Foundations",
    "Foundations",
    "foundations/keyboard",
    "specs/interaction/keyboard.md",
  ],
  ["Patterns", "Patterns", "patterns/forms", "specs/patterns/forms.md"],
  ["Patterns", "Patterns", "patterns/states", "specs/patterns/states.md"],
  [
    "Patterns",
    "Patterns",
    "patterns/search-and-filter",
    "specs/patterns/search-filter.md",
  ],
  [
    "Resources",
    "Resources",
    "resources/component-conventions",
    "specs/components/conventions.md",
  ],
  ["Resources", "Resources", "resources/releasing", "docs/releasing.md"],
  [
    "Resources",
    "Resources",
    "resources/payload-adapter",
    "docs/payload-adapter.md",
  ],
  ["Resources", "Resources", "resources/ai-agents", "docs/agents-consumer.md"],
  ["Resources", "Resources", "resources/atlas-pilot", "docs/pilot-atlas.md"],
] as const;

function withIds(html: string): { html: string; toc: Page["toc"] } {
  const toc: Page["toc"] = [];
  const out = html.replaceAll(
    /<h([23])>(.*?)<\/h\1>/g,
    (_, level: string, text: string) => {
      const id = slugify(text);
      if (level === "2") toc.push([id, text.replaceAll(/<[^>]+>/g, "")]);
      return `<h${level} id="${id}">${text}</h${level}>`;
    },
  );
  return { html: out, toc };
}

for (const [section, group, path, source] of guideSources) {
  const raw = await readFile(repo(source), "utf8");
  const rendered = await marked.parse(raw);
  const heading = /<h1>(.*?)<\/h1>/.exec(rendered)?.[1] ?? path;
  const withoutH1 = rendered.replace(/<h1>.*?<\/h1>/, "");
  const { html, toc } = withIds(
    withoutH1
      .replaceAll("<table>", '<div class="tablewrap"><table>')
      .replaceAll("</table>", "</table></div>"),
  );
  pages.push({
    path: `${path}.html`,
    title: guideTitles[path] ?? heading.replaceAll(/<[^>]+>/g, ""),
    section,
    group,
    body: html,
    toc,
    search: raw.slice(0, 400).replaceAll(/[#*`|>-]/g, " "),
  });
}

// Components
const codeTabs = ["HTML", "React", "Svelte"] as const;

function exampleBlock(
  example: ComponentDoc["examples"][number],
  tall: boolean | undefined,
): string {
  const sources = [example.html, example.react, example.svelte];
  return `<div class="example">
<div class="stage${tall || example.tall ? " tall" : ""}">${example.html}</div>
${example.note ? `<p class="note">${inline(example.note)}</p>` : ""}
<div class="bar" role="tablist" aria-label="Code">${codeTabs
    .map(
      (label, i) =>
        `<button class="tab" role="tab" aria-selected="${String(i === 1)}">${label}</button>`,
    )
    .join("")}<button class="copy" type="button">Copy</button></div>
${sources.map((source, i) => `<pre${i === 1 ? "" : " hidden"}><code>${escape(source)}</code></pre>`).join("\n")}
</div>`;
}

function componentBody(doc: ComponentDoc): { body: string; toc: Page["toc"] } {
  const list = (items: string[]) =>
    `<ul>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`;
  const sections: [string, string][] = [
    [
      "Usage",
      `<div class="usage"><div><h3>Use when</h3>${list(doc.useWhen)}</div><div class="no"><h3>Don’t use when</h3>${list(doc.dontUseWhen)}</div></div>`,
    ],
    [
      "Examples",
      doc.examples
        .map(
          (example) =>
            `<h3>${example.title}</h3>${exampleBlock(example, doc.tall)}`,
        )
        .join("\n"),
    ],
    [
      "Configurations",
      doc.configurations
        .map((c) => `<h3>${c.title}</h3><p>${inline(c.body)}</p>`)
        .join("\n"),
    ],
    ["Accessibility", list(doc.accessibility)],
    ...(doc.keyboard
      ? ([
          [
            "Keyboard",
            `<div class="tablewrap"><table><tr><th>Key</th><th>Action</th></tr>${doc.keyboard
              .map(
                ([key, action]) =>
                  `<tr><td><kbd>${escape(key)}</kbd></td><td>${inline(action)}</td></tr>`,
              )
              .join("")}</table></div>`,
          ],
        ] as [string, string][])
      : []),
    [
      "API",
      `<p>Same props in React and Svelte unless noted. Native attributes of the underlying element are passed through.</p><div class="tablewrap"><table><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>${doc.props
        .map(
          ([name, type, def, text]) =>
            `<tr><td><code>${escape(name)}</code></td><td><code>${escape(type)}</code></td><td>${def ? `<code>${escape(def)}</code>` : "–"}</td><td>${inline(text)}</td></tr>`,
        )
        .join("")}</table></div>`,
    ],
  ];
  return {
    toc: sections.map(([title]) => [slugify(title), title]),
    body: `<span class="status m-badge" data-tone="${doc.status === "stable" ? "success" : "warning"}">${doc.status === "stable" ? "Stable" : "Beta"}</span>
${sections.map(([title, html]) => `<h2 id="${slugify(title)}">${title}</h2>\n${html}`).join("\n")}`,
  };
}

for (const doc of components) {
  const { body, toc } = componentBody(doc);
  pages.push({
    path: `components/${doc.slug}.html`,
    title: doc.name,
    section: "Components",
    group: "Components",
    lead: doc.description,
    body,
    toc,
    search: `${doc.description} ${doc.useWhen.join(" ")}`,
  });
}

pages.push({
  path: "components/index.html",
  title: "Components",
  section: "Components",
  group: "",
  lead: "The building blocks for creating interfaces. Every component ships as shared CSS plus thin React and Svelte implementations.",
  toc: [],
  search: "overview all components",
  body: `<div class="cards">${components
    .map(
      (doc) =>
        `<a class="tile" href="${doc.slug}.html"><div class="thumb">${doc.examples[0]?.html ?? ""}</div><div class="body"><strong>${doc.name}</strong><span>${escape(doc.description)}</span></div></a>`,
    )
    .join("")}</div>`,
});

// Foundations: tokens and icons
const colorRoles = index.tokenNames.filter((name) =>
  /^(bg|surface|text|border|accent|primary|info|success|warning|danger|focus|overlay|placeholder)/.test(
    name,
  ),
);
const tokenSwatch = (name: string) =>
  `<div class="swatch"><i style="background:var(--m-${name})"></i><div><code>--m-${name}</code><span data-token="${name}"></span></div></div>`;

pages.push({
  path: "foundations/tokens.html",
  title: "Tokens",
  section: "Foundations",
  group: "Foundations",
  lead: `${String(index.tokenNames.length)} design tokens, shared by every component. Use the display menu in the header to switch theme, colour mode and density: everything on this page follows live.`,
  toc: [
    ["colour", "Colour"],
    ["typography", "Typography"],
    ["spacing", "Spacing"],
    ["radius", "Radius and shadow"],
    ["themes-and-density", "Themes and density"],
  ],
  search: "tokens colour typography spacing radius theme density css variables",
  body: `<h2 id="colour">Colour</h2>
<p>Colours are roles, not values: components reference roles such as <code>--m-surface</code> or <code>--m-danger</code>, and each theme and colour mode maps them to concrete colours. Never hardcode a colour.</p>
<div class="swatches">${colorRoles.map(tokenSwatch).join("")}</div>
<h2 id="typography">Typography</h2>
<div class="tablewrap"><table><tr><th>Token</th><th>Value</th><th>Sample</th></tr>${index.tokenNames
    .filter((name) => name.startsWith("fs-"))
    .map(
      (name) =>
        `<tr><td><code>--m-${name}</code></td><td data-token="${name}"></td><td style="font-size:var(--m-${name})">The quick brown fox</td></tr>`,
    )
    .join("")}</table></div>
<p>Families: <code>--m-font-sans</code>, <code>--m-font-mono</code>. Weights: ${index.tokenNames
    .filter((name) => name.startsWith("fw-"))
    .map((name) => `<code>--m-${name}</code>`)
    .join(", ")}.</p>
<h2 id="spacing">Spacing</h2>
<div class="scale">${index.tokenNames
    .filter((name) => name.startsWith("space-"))
    .sort((a, b) => Number(a.slice(6)) - Number(b.slice(6)))
    .map(
      (name) =>
        `<div><code>--m-${name}</code><i style="width:var(--m-${name})"></i><span data-token="${name}"></span></div>`,
    )
    .join("")}</div>
<h2 id="radius">Radius and shadow</h2>
<div class="swatches">${index.tokenNames
    .filter((name) => name.startsWith("radius-"))
    .map(
      (name) =>
        `<div class="swatch"><i style="background:var(--m-accent-soft);border-radius:var(--m-${name})"></i><div><code>--m-${name}</code><span data-token="${name}"></span></div></div>`,
    )
    .join("")}${["sm", "md", "lg"]
    .map(
      (size) =>
        `<div class="swatch"><i style="box-shadow:var(--m-shadow-${size});margin:0.5rem;height:2rem;background:var(--m-surface)"></i><div><code>--m-shadow-${size}</code></div></div>`,
    )
    .join("")}</div>
<h2 id="themes-and-density">Themes and density</h2>
<p>Three attributes on <code>&lt;html&gt;</code> select the look. All are optional.</p>
<div class="tablewrap"><table><tr><th>Attribute</th><th>Values</th><th>Default</th></tr>
<tr><td><code>data-theme</code></td><td>${index.themes.map((t) => `<code>${t}</code>`).join(", ")}</td><td><code>deep-space</code></td></tr>
<tr><td><code>data-color-mode</code></td><td><code>light</code>, <code>dark</code></td><td>OS preference</td></tr>
<tr><td><code>data-density</code></td><td>${index.densities.map((t) => `<code>${t}</code>`).join(", ")}</td><td><code>comfortable</code></td></tr></table></div>
<p>Density changes the control height (compact 28px, comfortable 36px, touch 48px), padding and font size. The Professional theme inherits Deep Space and only changes theme-level tokens such as the control radius.</p>`,
});

const iconDir = repo("packages/icons/svg");
const iconFiles = (await readdir(iconDir))
  .filter((f) => f.endsWith(".svg"))
  .sort();
const iconCells = await Promise.all(
  iconFiles.map(async (file) => {
    const svg = await readFile(`${iconDir}/${file}`, "utf8");
    const inner = /<svg[^>]*>([\s\S]*)<\/svg>/.exec(svg)?.[1] ?? "";
    const name = file.replace(".svg", "");
    return `<div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>${name}</div>`;
  }),
);
pages.push({
  path: "foundations/icons.html",
  title: "Icons",
  section: "Foundations",
  group: "Foundations",
  lead: `${String(iconFiles.length)} stroke icons on a 24px grid. They inherit the text colour and ship as tree-shakeable named exports.`,
  toc: [
    ["usage", "Usage"],
    ["all-icons", "All icons"],
  ],
  search: "icons svg stroke named exports",
  body: `<h2 id="usage">Usage</h2>
<pre><code>${escape(`import { search } from "@interstellarforge/matter-icons";
import { Icon } from "@interstellarforge/matter-react"; // or -svelte

<Icon icon={search} label="Search" />`)}</code></pre>
<p>Without <code>label</code> the icon is decorative. Use <code>iconNames</code>, the <code>icons</code> lookup map and the <code>IconName</code> type for dynamic cases; static imports keep the bundle small.</p>
<h2 id="all-icons">All icons</h2>
<div class="icons">${iconCells.join("")}</div>`,
});

// Get started
const startCode = (source: string) =>
  `<pre><code>${escape(source)}</code></pre>`;
pages.push({
  path: "get-started/introduction.html",
  title: "Introduction",
  section: "Get started",
  group: "Get started",
  lead: "Matter is the design and experience system of Interstellarforge: design tokens, shared CSS, icons, and React and Svelte components that look and behave the same.",
  toc: [
    ["what-is-in-it", "What is in it"],
    ["principles", "Principles"],
  ],
  search: "introduction what is matter packages principles",
  body: `<h2 id="what-is-in-it">What is in it</h2>
<div class="tablewrap"><table><tr><th>Package</th><th>Purpose</th></tr>
<tr><td><code>@interstellarforge/matter-tokens</code></td><td>Design tokens (DTCG) and their generated CSS.</td></tr>
<tr><td><code>@interstellarforge/matter-css</code></td><td>The stylesheet <code>matter.css</code> (tokens + components) and the no-flash theme script.</td></tr>
<tr><td><code>@interstellarforge/matter-icons</code></td><td>${String(iconFiles.length)} icons as tree-shakeable exports.</td></tr>
<tr><td><code>@interstellarforge/matter-react</code></td><td>React 19 components, server-component friendly.</td></tr>
<tr><td><code>@interstellarforge/matter-svelte</code></td><td>Svelte 5 components.</td></tr></table></div>
<h2 id="principles">Principles</h2>
<ul>
<li><strong>One stylesheet, thin components.</strong> React and Svelte emit the same markup; behaviour is added only where the platform has none.</li>
<li><strong>Tokens, never values.</strong> Colour, spacing and type come from tokens, so themes, colour modes and densities work everywhere.</li>
<li><strong>Accessible by default.</strong> Native elements, visible focus, keyboard support and tested with axe. See the <a href="../foundations/accessibility.html">accessibility baseline</a>.</li>
<li><strong>Generic only.</strong> Matter holds building blocks; domain logic stays in the product.</li>
</ul>`,
});
pages.push({
  path: "get-started/installation.html",
  title: "Installation",
  section: "Get started",
  group: "Get started",
  lead: "Install the stylesheet and the components for your framework, then prevent the theme flash.",
  toc: [
    ["install", "Install"],
    ["react", "React and Next.js"],
    ["svelte", "Svelte and SvelteKit"],
    ["without-a-framework", "Without a framework"],
  ],
  search: "install npm pnpm react nextjs svelte sveltekit css theme init",
  body: `<h2 id="install">Install</h2>
${startCode(`pnpm add @interstellarforge/matter-css @interstellarforge/matter-icons
pnpm add @interstellarforge/matter-react   # or @interstellarforge/matter-svelte`)}
<p>Packages are published on npmjs.com under the MIT licence. Use the same version for every Matter package.</p>
<h2 id="react">React and Next.js</h2>
<p>Import the stylesheet once, and inline the theme script in <code>&lt;head&gt;</code> so the stored theme applies before first paint.</p>
${startCode(`// app/layout.tsx
import "@interstellarforge/matter-css/matter.css";
import { themeInitScript } from "@interstellarforge/matter-css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInitScript }} /></head>
      <body>{children}</body>
    </html>
  );
}`)}
<p>Interactive components (Tabs, Dialog, Tooltip, Menu, Checkbox, Switch) are client components; static ones (Badge, Card, Banner, …) work in server components.</p>
<h2 id="svelte">Svelte and SvelteKit</h2>
${startCode(`// src/routes/+layout.svelte
import "@interstellarforge/matter-css/matter.css";

// src/hooks.server.ts: replace a %matter.init% placeholder in app.html
import { themeInitScript } from "@interstellarforge/matter-css";
export const handle = ({ event, resolve }) =>
  resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace("%matter.init%", \`<script>\${themeInitScript}</script>\`),
  });`)}
<h2 id="without-a-framework">Without a framework</h2>
<p>Load <code>matter.css</code> and, if your Content Security Policy forbids inline scripts, <code>theme-init.js</code> with <code>&lt;script src&gt;</code>. The CSS classes (<code>m-button</code>, …) are documented on every component page.</p>
${startCode(`<link rel="stylesheet" href="matter.css">
<script src="theme-init.js"></script>`)}`,
});
pages.push({
  path: "get-started/theming.html",
  title: "Theming",
  section: "Get started",
  group: "Get started",
  lead: "Themes, colour modes and densities are plain attributes on the root element.",
  toc: [
    ["attributes", "Attributes"],
    ["persisting-the-choice", "Persisting the choice"],
    ["overriding-tokens", "Overriding tokens"],
    ["css-layers", "CSS layers"],
  ],
  search: "theming theme dark light density attributes layers override",
  body: `<h2 id="attributes">Attributes</h2>
${startCode(`<html data-theme="professional" data-color-mode="dark" data-density="compact">`)}
<p>Without attributes you get the Deep Space theme, the operating system colour mode and the comfortable density. See <a href="../foundations/tokens.html#themes-and-density">Tokens</a> for all values.</p>
<h2 id="persisting-the-choice">Persisting the choice</h2>
<p>The theme script reads <code>matter-theme</code>, <code>matter-color-mode</code> and <code>matter-density</code> from <code>localStorage</code> and sets the attributes before first paint. Your settings UI only needs to write both the attribute and the storage key.</p>
${startCode(`document.documentElement.setAttribute("data-color-mode", "dark");
localStorage.setItem("matter-color-mode", "dark");`)}
<h2 id="overriding-tokens">Overriding tokens</h2>
<p>A product may override a token for its own scope, for example a different control height. Prefer a token override over restyling components.</p>
${startCode(`:root { --m-control-h: 38px; }`)}
<h2 id="css-layers">CSS layers</h2>
<p>Matter styles live in <code>@layer matter.reset, matter.tokens, matter.base, matter.components</code>. <strong>Unlayered CSS beats layered CSS</strong>, so global element rules in your app (<code>input { min-height: … }</code>) override Matter components. Put them in a layer declared before <code>matter.components</code>, or remove them as you adopt components.</p>`,
});

// Home
pages.push({
  path: "index.html",
  title: "Matter",
  section: "Home",
  group: "",
  toc: [],
  search: "design system tokens components patterns get started",
  body: `<div class="hero"><h1>Matter</h1><p class="lead">The design and experience system of Interstellarforge. Tokens, components and patterns for building consistent, accessible products in React and Svelte.</p><a class="m-button" data-variant="primary" data-size="lg" href="get-started/installation.html">Get started</a></div>
<div class="cards">
<a class="tile" href="get-started/introduction.html"><div class="thumb"><span class="m-badge" data-tone="accent">npm i</span></div><div class="body"><strong>Get started</strong><span>What Matter is, how to install it and how to theme it.</span></div></a>
<a class="tile" href="foundations/tokens.html"><div class="thumb"><span class="m-avatar" role="img" aria-label="">T</span><span class="m-badge" data-tone="info">--m-*</span></div><div class="body"><strong>Foundations</strong><span>Tokens, icons, accessibility and keyboard rules.</span></div></a>
<a class="tile" href="components/index.html"><div class="thumb"><button class="m-button" data-variant="primary">Button</button></div><div class="body"><strong>Components</strong><span>${String(components.length)} building blocks with examples, usage and API.</span></div></a>
<a class="tile" href="patterns/forms.html"><div class="thumb"><input class="m-input" aria-label="" placeholder="Name"></div><div class="body"><strong>Patterns</strong><span>Forms, states, search and filter: reusable solutions.</span></div></a>
</div>`,
});

// Navigation
const nav: [string, [string, string][]][] = [
  [
    "Get started",
    pages
      .filter((p) => p.section === "Get started")
      .map((p) => [p.path, p.title]),
  ],
  [
    "Foundations",
    ["tokens", "icons", "accessibility", "keyboard"]
      .map((s) => `foundations/${s}.html`)
      .map((path) => [path, pages.find((p) => p.path === path)?.title ?? path]),
  ],
  [
    "Components",
    [
      ["components/index.html", "Overview"],
      ...components.map((c): [string, string] => [
        `components/${c.slug}.html`,
        c.name,
      ]),
    ],
  ],
  [
    "Patterns",
    pages.filter((p) => p.section === "Patterns").map((p) => [p.path, p.title]),
  ],
  [
    "Resources",
    pages
      .filter((p) => p.section === "Resources")
      .map((p) => [p.path, p.title]),
  ],
];

const searchSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;

function shell(page: Page): string {
  const depth = page.path.split("/").length - 1;
  const root = depth === 0 ? "./" : "../".repeat(depth);
  const select = (name: string, values: string[]) =>
    `<label>${name}<select class="m-input" data-switch="${name}">${values.map((v) => `<option>${v}</option>`).join("")}</select></label>`;
  const side = nav
    .map(
      ([heading, items]) =>
        `<h2>${heading}</h2><ul>${items
          .map(
            ([path, title]) =>
              `<li><a href="${root}${path}"${path === page.path ? ' aria-current="page"' : ""}>${escape(title)}</a></li>`,
          )
          .join("")}</ul>`,
    )
    .join("");
  const crumbs =
    page.section === "Home"
      ? ""
      : `<div class="crumbs"><a href="${root}index.html">Home</a> / ${page.section}${page.group && page.title !== page.section ? ` / ${escape(page.title)}` : ""}</div>`;
  const toc = page.toc.length
    ? `<aside class="toc" aria-label="On this page"><h2>On this page</h2>${page.toc.map(([id, text]) => `<a href="#${id}">${escape(text)}</a>`).join("")}</aside>`
    : "";
  return `<!doctype html>
<html lang="en" data-root="${root}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.section === "Home" ? "Matter Design System" : `${escape(page.title)} · Matter`}</title>
<script src="${root}theme-init.js"></script>
<link rel="stylesheet" href="${root}matter.css">
<link rel="stylesheet" href="${root}site.css">
<link rel="icon" href="data:,">
</head>
<body${page.section === "Home" ? ' class="home"' : ""}>
<header class="top">
<button class="m-button menu-toggle" data-icon-only aria-label="Menu" aria-expanded="false" type="button">☰</button>
<a class="brand" href="${root}index.html"><i></i>Matter <small>Design System</small></a>
<div class="grow"></div>
<div class="search">${searchSvg}<input class="m-input" type="search" placeholder="Search (press /)" aria-label="Search the documentation" autocomplete="off"><ul class="results" hidden></ul></div>
<details class="display"><summary class="m-button" data-variant="ghost">Display</summary><div>${select("theme", index.themes)}${select("color-mode", ["system", "light", "dark"])}${select("density", index.densities)}</div></details>
</header>
<div class="shell${page.toc.length ? "" : " no-toc"}">
<nav class="side" aria-label="Documentation">${side}</nav>
<main id="main"><article>
${
  page.section === "Home"
    ? ""
    : `${crumbs}
<h1>${escape(page.title)}</h1>`
}
${page.lead ? `<p class="lead">${inline(page.lead)}</p>` : ""}
${page.body}
<p class="footer">Matter by Interstellarforge · MIT licence</p>
</article></main>
${toc}
</div>
<script src="${root}site.js"></script>
</body>
</html>
`;
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await Promise.all([
  cp(repo("packages/css/dist/matter.css"), `${dist}matter.css`),
  cp(repo("packages/css/dist/theme-init.js"), `${dist}theme-init.js`),
  writeFile(`${dist}site.css`, await here("./site.css")),
  writeFile(`${dist}site.js`, await here("./site.js")),
  writeFile(
    `${dist}search.json`,
    JSON.stringify(
      pages.map((page) => ({
        title: page.title,
        url: page.path,
        section: page.section,
        text: page.lead ?? page.search,
      })),
    ),
  ),
]);
for (const page of pages) {
  const file = `${dist}${page.path}`;
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, shell(page));
}
console.log(`docs: ${String(pages.length)} pages`);
