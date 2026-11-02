import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const stateHooks =
  /\buse(State|Effect|LayoutEffect|Reducer|Callback|Memo|Ref)\b/;
const sourceDir = join(process.cwd(), "src");
const sourceFiles = readdirSync(sourceDir).filter(
  (file) => file.endsWith(".tsx") && !file.includes(".test."),
);

describe("react server/client boundary", () => {
  it.each(sourceFiles)(
    "%s uses 'use client' whenever it uses state hooks or refs",
    (file) => {
      expect.hasAssertions();

      const source = readFileSync(join(sourceDir, file), "utf8");
      const usesClientApi =
        stateHooks.test(source) || /\bref=\{\(/.test(source);

      if (usesClientApi) {
        expect(source.startsWith('"use client"')).toBe(true);
      } else {
        expect(source.startsWith('"use client"')).toBe(false);
      }
    },
  );
});
