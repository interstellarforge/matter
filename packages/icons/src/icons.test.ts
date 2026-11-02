import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { loadIcons } from "./build.ts";

const svgDir = join(process.cwd(), "svg");
const files = readdirSync(svgDir).filter((file) => file.endsWith(".svg"));

describe("matter icons", () => {
  it("uses kebab-case names, the 24 grid and currentColor only", () => {
    expect.hasAssertions();

    for (const file of files) {
      const svg = readFileSync(join(svgDir, file), "utf8");

      expect(file).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*\.svg$/);
      expect(svg).toContain('viewBox="0 0 24 24"');
      expect(svg).toContain('stroke="currentColor"');
      expect(svg).not.toMatch(/#[0-9a-f]{3,6}|rgb\(/i);
    }
  });

  it("optimises every icon to a non-empty body without width/height", async () => {
    expect.hasAssertions();

    const icons = await loadIcons();

    expect(icons).toHaveLength(files.length);

    for (const { body } of icons) {
      expect(body.length).toBeGreaterThan(0);
      expect(body).not.toMatch(/width=|height=/);
    }
  });

  it("exposes every icon by name for dynamic lookup", async () => {
    expect.hasAssertions();

    const { icons, iconNames } = await import("../dist/index.js");

    expect(Object.keys(icons).sort()).toStrictEqual([...iconNames].sort());
    expect(icons["chevron-down"].name).toBe("chevron-down");
  });
});
