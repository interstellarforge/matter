import { runInNewContext } from "node:vm";

import { describe, expect, it } from "vitest";

import { themeInitScript } from "./theme-init.ts";

function run(
  stored: Record<string, string>,
  throwing = false,
): Map<string, string> {
  const attributes = new Map<string, string>();
  const document = {
    documentElement: {
      setAttribute: (name: string, value: string) =>
        attributes.set(name, value),
    },
  };
  const localStorage = {
    getItem: (key: string): string | undefined => {
      if (throwing) {
        throw new Error("blocked");
      }
      return stored[key];
    },
  };
  runInNewContext(themeInitScript, { document, localStorage });
  return attributes;
}

describe("theme init script", () => {
  it("applies stored theme, colour mode and density", () => {
    expect.hasAssertions();

    const attributes = run({
      "matter-theme": "professional",
      "matter-density": "compact",
    });

    expect(Object.fromEntries(attributes)).toStrictEqual({
      "data-theme": "professional",
      "data-density": "compact",
    });
  });

  it("does nothing when storage is blocked", () => {
    expect.hasAssertions();

    expect(run({}, true).size).toBe(0);
  });
});
