import { render, screen } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Breadcrumb,
  ButtonGroup,
  Combobox,
  DatePicker,
  DateRangePicker,
  FileUpload,
  Pagination,
  Sidebar,
  ToastRegion,
} from "../src/index.ts";
import { violations } from "./axe.ts";
import FieldHarness from "./FieldHarness.svelte";
import SplitHarness from "./SplitHarness.svelte";
import TableHarness from "./TableHarness.svelte";

const options = [
  { value: "nl", label: "Netherlands" },
  { value: "be", label: "Belgium" },
  { value: "de", label: "Germany" },
];

describe("form field", () => {
  it("links label, hint and error and marks the control invalid and required", async () => {
    expect.hasAssertions();

    const { container } = render(FieldHarness);
    const input = screen.getByRole("textbox", { name: /Email/ });

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.hasAttribute("required")).toBe(true);
    expect(input.getAttribute("aria-describedby")?.split(" ")).toHaveLength(2);
    await expect(violations(container)).resolves.toStrictEqual([]);
  });
});

describe("combobox", () => {
  it("filters, picks with the keyboard and removes tags in multiple mode", async () => {
    expect.hasAssertions();

    const onValueChange = vi.fn<(value: string[]) => void>();
    const { container } = render(Combobox, {
      "aria-label": "Countries",
      options,
      multiple: true,
      emptyLabel: "No results",
      clearLabel: "Clear",
      removeLabel: (l: string) => `Remove ${l}`,
      onValueChange,
    });
    await userEvent.type(screen.getByRole("combobox"), "be{Enter}");
    await userEvent.type(screen.getByRole("combobox"), "ger{Enter}");

    expect(onValueChange).toHaveBeenLastCalledWith(["be", "de"]);
    await expect(violations(container)).resolves.toStrictEqual([]);

    await userEvent.click(
      screen.getByRole("button", { name: "Remove Belgium" }),
    );

    expect(onValueChange).toHaveBeenLastCalledWith(["de"]);
  });
});

describe("data table", () => {
  it("reports sort changes and selects rows", async () => {
    expect.hasAssertions();

    const onSort = vi.fn<(c: string, d: string) => void>();
    const { container } = render(TableHarness, { onSort });

    await userEvent.click(screen.getByRole("button", { name: "Name" }));

    expect(onSort).toHaveBeenCalledWith("name", "descending");

    await userEvent.click(screen.getByRole("checkbox", { name: "Select Ada" }));

    expect(
      screen.getByRole<HTMLInputElement>("checkbox", { name: "Select all" })
        .indeterminate,
    ).toBe(true);
    await expect(violations(container)).resolves.toStrictEqual([]);
  });
});

describe("navigation", () => {
  it("pagination marks the current page and disables the first previous", async () => {
    expect.hasAssertions();

    const onPageChange = vi.fn<(page: number) => void>();
    const { container } = render(Pagination, {
      label: "Pages",
      page: 1,
      pageCount: 10,
      onPageChange,
      previousLabel: "Previous",
      nextLabel: "Next",
      pageLabel: (n: number) => `Page ${String(n)}`,
    });

    expect(screen.getByRole("button", { name: "Previous" })).toHaveProperty(
      "disabled",
      true,
    );

    await userEvent.click(screen.getByRole("button", { name: "Page 10" }));

    expect(onPageChange).toHaveBeenCalledWith(10);
    await expect(violations(container)).resolves.toStrictEqual([]);
  });

  it("breadcrumb marks the current page and expands collapsed items", async () => {
    expect.hasAssertions();

    const items = ["A", "B", "C", "D", "E"].map((label) => ({
      label,
      href: `/${label}`,
    }));
    render(Breadcrumb, {
      label: "Breadcrumb",
      items,
      maxItems: 3,
      expandLabel: "Show all",
    });

    expect(screen.queryByText("B")).toBeNull();
    expect(screen.getByText("E").getAttribute("aria-current")).toBe("page");

    await userEvent.click(screen.getByRole("button", { name: "Show all" }));

    expect(screen.getByText("B")).toBeInstanceOf(HTMLElement);
  });

  it("sidebar toggles collapsible groups", async () => {
    expect.hasAssertions();

    const { container } = render(Sidebar, {
      label: "Main",
      groups: [
        {
          id: "g",
          label: "Content",
          collapsible: true,
          items: [{ id: "a", label: "Pages", href: "/pages", current: true }],
        },
      ],
    });

    expect(
      screen.getByRole("link", { name: "Pages" }).getAttribute("aria-current"),
    ).toBe("page");

    await userEvent.click(screen.getByRole("button", { name: /Content/ }));

    expect(screen.queryByRole("link", { name: "Pages" })).toBeNull();
    await expect(violations(container)).resolves.toStrictEqual([]);
  });
});

describe("feedback", () => {
  it("toast announces by tone and runs the action", async () => {
    expect.hasAssertions();

    const onDismiss = vi.fn<(id: string) => void>();
    const onAction = vi.fn<() => void>();
    render(ToastRegion, {
      dismissLabel: "Dismiss",
      onDismiss,
      toasts: [
        { id: "e", tone: "danger", message: "Failed", duration: 0 },
        {
          id: "s",
          message: "Saved",
          duration: 0,
          action: { label: "Undo", onAction },
        },
      ],
    });

    expect(screen.getByRole("alert").textContent).toContain("Failed");

    await userEvent.click(screen.getByRole("button", { name: "Undo" }));

    expect(onAction).toHaveBeenCalledWith();
    expect(onDismiss).toHaveBeenCalledWith("s");
  });

  it("file upload hands over only the first file when single", async () => {
    expect.hasAssertions();

    const onFilesAdded = vi.fn<(files: File[]) => void>();
    const { container } = render(FileUpload, {
      label: "Choose a file",
      onFilesAdded,
      files: [
        { id: "1", name: "a.png", progress: 40 },
        { id: "2", name: "b.png", error: "Too large" },
      ],
    });
    const a = new File(["a"], "a.png", { type: "image/png" });
    const b = new File(["b"], "b.png", { type: "image/png" });
    await userEvent.upload(screen.getByLabelText("Choose a file"), [a, b]);

    expect(onFilesAdded).toHaveBeenCalledWith([a]);
    expect(screen.getByRole("progressbar", { name: "a.png" })).toBeInstanceOf(
      HTMLElement,
    );
    await expect(violations(container)).resolves.toStrictEqual([]);
  });

  it("date range keeps end after start via min/max", () => {
    expect.hasAssertions();

    render(DateRangePicker, {
      legend: "Period",
      startLabel: "From",
      endLabel: "To",
      value: { start: "2026-11-01", end: "2026-11-10" },
    });

    expect(screen.getByLabelText("To").getAttribute("min")).toBe("2026-11-01");
    expect(screen.getByLabelText("From").getAttribute("max")).toBe(
      "2026-11-10",
    );
  });
});

describe("date picker calendar", () => {
  it("opens on the selected day, moves with arrows, selects and ignores days before min", async () => {
    expect.hasAssertions();

    const onValueChange = vi.fn<(value: string) => void>();
    const { container } = render(DatePicker, {
      "aria-label": "Start",
      value: "2026-11-04",
      min: "2026-11-02",
      locale: "en",
      onValueChange,
      calendar: {
        openLabel: (field: string) => `Choose ${field}`,
        previousMonthLabel: "Previous month",
        nextMonthLabel: "Next month",
      },
    });
    await userEvent.click(screen.getByRole("button", { name: "Choose Start" }));

    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: /November 4, 2026/ }),
    );
    await expect(violations(container)).resolves.toStrictEqual([]);

    await userEvent.click(
      screen.getByRole("button", { name: /November 1, 2026/ }),
    );

    expect(onValueChange).not.toHaveBeenCalled();

    await userEvent.keyboard("{ArrowRight}{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenCalledWith("2026-11-12");
    expect(screen.getByLabelText<HTMLInputElement>("Start").value).toBe(
      "2026-11-12",
    );
  });
});

describe("split button", () => {
  it("runs the main action, opens the menu with the keyboard and selects", async () => {
    expect.hasAssertions();

    const onClick = vi.fn<() => void>();
    const onSelect = vi.fn<(id: string) => void>();
    const { container } = render(SplitHarness, { onClick, onSelect });
    await userEvent.click(
      screen.getByRole("button", { name: "Publish changes" }),
    );

    expect(onClick).toHaveBeenCalledTimes(1);

    const trigger = screen.getByRole("button", {
      name: "More publish options",
    });
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(
      screen.getByRole("menuitem", { name: "Save draft" }),
    );
    await expect(violations(container)).resolves.toStrictEqual([]);

    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(onSelect).toHaveBeenCalledWith("unpublish");
    expect(document.activeElement).toBe(trigger);
  });

  it("button group is a named group", () => {
    expect.hasAssertions();

    render(ButtonGroup, { label: "View" });

    expect(screen.getByRole("group", { name: "View" })).toBeInstanceOf(
      HTMLElement,
    );
  });
});
