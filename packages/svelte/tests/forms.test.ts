import { search } from "@interstellarforge/matter-icons";
import { render, screen } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Button,
  Checkbox,
  Icon,
  IconButton,
  Input,
  Select,
  Switch,
  Textarea,
} from "../src/index.ts";
import { violations } from "./axe.ts";
import FormHarness from "./FormHarness.svelte";

describe("form controls", () => {
  it("button blocks clicks while loading but stays focusable", async () => {
    expect.hasAssertions();

    const onclick = vi.fn();
    render(Button, { loading: true, onclick, children: textSnippet("Save") });
    const button = screen.getByRole("button", { name: "Save" });
    await userEvent.click(button);

    expect(onclick).not.toHaveBeenCalled();
    expect(button).toHaveProperty("disabled", false);
    expect(button.getAttribute("aria-busy")).toBe("true");
  });

  it("icon button takes its accessible name from label", () => {
    expect.hasAssertions();

    render(IconButton, { label: "Close", children: textSnippet("×") });

    expect(
      screen.getByRole("button", { name: "Close" }).dataset["iconOnly"],
    ).toBe("");
  });

  it("marks invalid fields with aria-invalid", () => {
    expect.hasAssertions();

    render(Input, { "aria-label": "Name", invalid: true });
    render(Textarea, { "aria-label": "Notes", invalid: true });
    render(Select, { "aria-label": "Type", invalid: true });

    for (const name of ["Name", "Notes", "Type"]) {
      expect(screen.getByLabelText(name).getAttribute("aria-invalid")).toBe(
        "true",
      );
    }
  });

  it("checkbox toggles and supports indeterminate", async () => {
    expect.hasAssertions();

    render(Checkbox, { indeterminate: true, children: textSnippet("Accept") });
    const box = screen.getByRole("checkbox", { name: "Accept" });

    expect(box).toHaveProperty("indeterminate", true);

    await userEvent.click(box);

    expect(box).toHaveProperty("checked", true);
    expect(box).toHaveProperty("indeterminate", false);
  });

  it("switch toggles with click and with the keyboard and reports changes", async () => {
    expect.hasAssertions();

    const onCheckedChange = vi.fn();
    render(Switch, { "aria-label": "Remote", onCheckedChange });
    const toggle = screen.getByRole("switch", { name: "Remote" });
    await userEvent.click(toggle);
    toggle.focus();
    await userEvent.keyboard(" ");

    expect(onCheckedChange).toHaveBeenNthCalledWith(1, true);
    expect(onCheckedChange).toHaveBeenNthCalledWith(2, false);
    expect(toggle.getAttribute("aria-checked")).toBe("false");
  });

  it("icon is decorative without a label and an image with one", () => {
    expect.hasAssertions();

    const { container } = render(Icon, { icon: search });
    render(Icon, { icon: search, label: "Search" });

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(screen.getByRole("img", { name: "Search" })).toBeTruthy();
  });

  it("has no axe violations for a composed form", async () => {
    expect.hasAssertions();

    const { container } = render(FormHarness);

    expect(await violations(container)).toStrictEqual([]);
  });
});

function textSnippet(text: string) {
  // Minimal snippet: a function that renders a text node into the anchor
  return ((anchor: Comment) => {
    anchor.before(document.createTextNode(text));
  }) as never;
}
