// @vitest-environment node
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";

import SsrHarness from "./SsrHarness.svelte";

describe("server rendering", () => {
  it("renders every component without touching the DOM", () => {
    expect.hasAssertions();

    const { body } = render(SsrHarness);

    for (const fragment of [
      "m-button",
      'data-variant="primary"',
      'role="switch"',
      'aria-checked="true"',
      'role="tablist"',
      "m-dialog",
      'role="tooltip"',
      'aria-haspopup="menu"',
    ]) {
      expect(body).toContain(fragment);
    }
  });

  it("produces the same ids on every render so hydration does not mismatch", () => {
    expect.hasAssertions();

    expect(render(SsrHarness).body).toBe(render(SsrHarness).body);
  });
});
