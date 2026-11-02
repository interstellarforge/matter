import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { violations } from "./axe.ts";
import { Button, Dialog, Menu, Tabs, Tooltip } from "./index.ts";

const tabs = [
  { id: "a", label: "Overview", content: "Panel A" },
  { id: "b", label: "Details", content: "Panel B", disabled: true },
  { id: "c", label: "History", content: "Panel C" },
];

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Settings"
        closeLabel="Close"
      >
        Body
      </Dialog>
    </>
  );
}

describe("tabs", () => {
  it("moves with arrows, skips disabled tabs and uses roving tabindex", async () => {
    expect.hasAssertions();

    render(<Tabs label="Sections" items={tabs} />);
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
    expect(screen.getByRole("tabpanel").textContent).toBe("Panel C");

    await userEvent.keyboard("{Home}");

    expect(screen.getByRole("tabpanel").textContent).toBe("Panel A");
  });
});

describe("dialog", () => {
  it("opens, is named by its title and closes with the close button", async () => {
    expect.hasAssertions();

    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog", { name: "Settings" })).toBeTruthy();

    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("has no axe violations when open", async () => {
    expect.hasAssertions();

    const { container } = render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(await violations(container)).toStrictEqual([]);
  });
});

describe("menu", () => {
  it("opens with the arrow key, selects with Enter and returns focus on Escape", async () => {
    expect.hasAssertions();

    const onSelect = vi.fn();
    render(
      <Menu
        triggerLabel="Actions"
        onSelect={onSelect}
        items={[
          { id: "edit", label: "Edit" },
          { id: "archive", label: "Archive", disabled: true },
          { id: "delete", label: "Delete" },
        ]}
      />,
    );
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

    render(
      <Tooltip content="Saves the draft">
        <button type="button">Save</button>
      </Tooltip>,
    );
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
