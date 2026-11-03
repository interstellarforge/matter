import { describe, expect, it } from "vitest";

import { buildMapping, buildPayloadCss, remapAttributes } from "./css.ts";

describe("payload adapter", () => {
  it("moves Matter's attributes out of Payload's way", () => {
    expect.hasAssertions();

    const css = remapAttributes(
      ':root[data-theme="professional"][data-color-mode="dark"] {}\n:root:not([data-theme]):not([data-color-mode="light"]) {}',
    );

    expect(css).toBe(
      ':root[data-matter-theme="professional"][data-theme="dark"] {}\n:root:not([data-matter-theme]):not([data-theme="light"]) {}',
    );
  });

  it("covers every Payload variable family in the payload layer", () => {
    expect.hasAssertions();

    const mapping = buildMapping();

    expect(mapping.startsWith("@layer payload {")).toBe(true);
    expect(mapping.match(/--theme-elevation-\d+:/g)).toHaveLength(21);
    for (const family of ["success", "warning", "error"]) {
      expect(
        mapping.match(new RegExp(`--theme-${family}-\\d+:`, "g")),
      ).toHaveLength(19);
    }
    for (const name of [
      "--theme-bg",
      "--theme-text",
      "--theme-input-bg",
      "--style-radius-m",
      "--font-body",
    ]) {
      expect(mapping).toContain(`${name}:`);
    }
  });

  it("declares Payload's layer order before anything else", () => {
    expect.hasAssertions();

    expect(buildPayloadCss(":root{}")).toContain(
      "@layer payload-default, payload;\n:root{}",
    );
  });
});
