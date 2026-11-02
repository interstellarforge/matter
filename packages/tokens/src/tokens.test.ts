import { describe, expect, it } from "vitest";

import { buildCss } from "./css.ts";
import { loadTokens } from "./tokens.ts";
import { validate } from "./validate.ts";

describe("matter tokens", () => {
  it("has no contrast or completeness errors", async () => {
    expect.hasAssertions();

    const errors = validate(await loadTokens()).filter(
      ({ level }) => level === "error",
    );

    expect(errors).toStrictEqual([]);
  });

  it("builds deterministic CSS with every theme, mode and density selector", async () => {
    expect.hasAssertions();

    const css = buildCss(await loadTokens());

    expect(buildCss(await loadTokens())).toBe(css);

    for (const selector of [
      ":root:not([data-theme])",
      // explicit mode must also work on the default theme without data-theme
      ':root:not([data-theme])[data-color-mode="dark"]',
      ':root[data-theme="deep-space"][data-color-mode="dark"]',
      ':root[data-theme="professional"][data-color-mode="dark"]',
      '[data-density="compact"]',
      '[data-density="touch"]',
      "@media (prefers-color-scheme: dark)",
    ]) {
      expect(css).toContain(selector);
    }

    expect(css).toContain("--m-surface-raised:");
    expect(css).toContain("--m-ease: cubic-bezier(0.2, 0.7, 0.25, 1);");
  });
});
