import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { optimize } from "svgo";

const svgDir = fileURLToPath(new URL("../svg/", import.meta.url));
const distDir = fileURLToPath(new URL("../dist/", import.meta.url));

export interface IconSource {
  name: string;
  body: string;
}

const camel = (name: string): string =>
  name.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());

/** Optimises every SVG in `svg/` and returns the inner markup (without the <svg> wrapper). */
export async function loadIcons(): Promise<IconSource[]> {
  const files = (await readdir(svgDir))
    .filter((f) => f.endsWith(".svg"))
    .sort();
  return Promise.all(
    files.map(async (file) => {
      const { data } = optimize(await readFile(`${svgDir}${file}`, "utf8"), {
        path: file,
        plugins: ["preset-default"],
      });
      const body = /<svg[^>]*>(?<inner>.*)<\/svg>/s.exec(data)?.groups?.[
        "inner"
      ];
      if (body === undefined) {
        throw new Error(`${file}: no <svg> element`);
      }
      return { name: file.replace(/\.svg$/, ""), body };
    }),
  );
}

if (import.meta.filename === process.argv[1]) {
  const icons = await loadIcons();
  const definitions = icons
    .map(
      ({ name, body }) =>
        `export const ${camel(name)} = { name: ${JSON.stringify(name)}, body: ${JSON.stringify(body)} };`,
    )
    .join("\n");
  const declarations = icons
    .map(({ name }) => `export declare const ${camel(name)}: IconDefinition;`)
    .join("\n");
  await mkdir(distDir, { recursive: true });
  await Promise.all([
    writeFile(
      `${distDir}index.js`,
      `${definitions}\nexport const iconNames = ${JSON.stringify(icons.map(({ name }) => name))};\n/** Lookup by name for dynamic use. Prefer the named exports: they tree-shake, this map does not. */\nexport const icons = { ${icons.map(({ name }) => `${JSON.stringify(name)}: ${camel(name)}`).join(", ")} };\n`,
    ),
    writeFile(
      `${distDir}index.d.ts`,
      `/** Inner SVG markup for a 24x24 viewBox, stroke 1.8, \`currentColor\`. */\nexport interface IconDefinition {\n  readonly name: string;\n  readonly body: string;\n}\n${declarations}\nexport declare const iconNames: readonly IconName[];\nexport type IconName = ${icons.map(({ name }) => JSON.stringify(name)).join(" | ")};\nexport declare const icons: Readonly<Record<IconName, IconDefinition>>;\n`,
    ),
  ]);
}
