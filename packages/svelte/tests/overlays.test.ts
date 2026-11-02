import { render, screen } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { violations } from "./axe.ts";
import DialogHarness from "./DialogHarness.svelte";
import MenuHarness from "./MenuHarness.svelte";
import TabsHarness from "./TabsHarness.svelte";
import TooltipHarness from "./TooltipHarness.svelte";

describe("tabs", () => {
  it("moves with arrows, skips disabled tabs and uses roving tabindex", async () => {
    expect.hasAssertions();

    render(TabsHarness);
    screen.getByRole("tab", { name: "Overview" }).focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(
      screen
        .getByRole("tab", { name: "History" })
        .getAttribute("aria-selected"),
    ).toBe("true");
    expect(
      screen.getByRole("tab", { name: "History" }).getAttribute("tabindex"),
    ).toBe("0");
    expect(
      screen.getByRole("tab", { name: "Overview" }).getAttribute("tabindex"),
    ).toBe("-1");
    expect(screen.getByRole("tabpanel").textContent.trim()).toBe("Panel C");

    await userEvent.keyboard("{Home}");

    expect(screen.getByRole("tabpanel").textContent.trim()).toBe("Panel A");
  });
});

describe("dialog", () => {
  it("opens, is named by its title and closes with the close button", async () => {
    expect.hasAssertions();

    render(DialogHarness);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog", { name: "Settings" })).toBeTruthy();

    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("has no axe violations when open", async () => {
    expect.hasAssertions();

    const { container } = render(DialogHarness);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(await violations(container)).toStrictEqual([]);
  });
});

describe("menu", () => {
  it("opens with the arrow key, selects with Enter and returns focus on Escape", async () => {
    expect.hasAssertions();

    const onSelect = vi.fn();
    render(MenuHarness, { onSelect });
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(
      screen.getByRole("menuitem", { name: "Edit" }),
    );

    await userEvent.keyboard("{ArrowDown}");

    expect(document.activeElement).toBe(
      screen.getByRole("menuitem", { name: "Delete" }),
    );

    await userEvent.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledWith("delete");

    await userEvent.keyboard("{ArrowDown}{Escape}");

    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("tooltip", () => {
  it("shows on focus, hides on Escape and describes the trigger", async () => {
    expect.hasAssertions();

    render(TooltipHarness);
    const trigger = screen.getByRole("button", { name: "Save" });
    const tip = document.querySelector("[role=tooltip]");

    expect(tip?.hasAttribute("hidden")).toBe(true);

    await userEvent.tab();

    expect(tip?.hasAttribute("hidden")).toBe(false);
    expect(trigger.getAttribute("aria-describedby")).toBe(tip?.id);

    await userEvent.keyboard("{Escape}");

    expect(tip?.hasAttribute("hidden")).toBe(true);
  });
});
