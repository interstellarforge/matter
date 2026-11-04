import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { violations } from "./axe.ts";
import {
  Breadcrumb,
  ButtonGroup,
  Combobox,
  DataTable,
  DatePicker,
  DateRangePicker,
  Drawer,
  FileUpload,
  FormField,
  Input,
  Pagination,
  Sidebar,
  SplitButton,
  ToastRegion,
} from "./index.ts";

const options = [
  { value: "nl", label: "Netherlands" },
  { value: "be", label: "Belgium" },
  { value: "de", label: "Germany" },
];

interface Row {
  id: string;
  name: string;
}
const rows: Row[] = [
  { id: "1", name: "Ada" },
  { id: "2", name: "Grace" },
];

function TableHarness({ onSort }: { onSort: (c: string, d: string) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <DataTable
      caption="People"
      rows={rows}
      columns={[
        { id: "name", header: "Name", sortable: true, cell: (r) => r.name },
      ]}
      sort={{ columnId: "name", direction: "ascending" }}
      onSortChange={(s) => {
        onSort(s.columnId, s.direction);
      }}
      selected={selected}
      onSelectedChange={setSelected}
      selectAllLabel="Select all"
      selectRowLabel={(r) => `Select ${r.name}`}
    />
  );
}

describe("form field", () => {
  it("links label, hint and error and marks the control invalid and required", async () => {
    expect.hasAssertions();

    const { container } = render(
      <FormField
        label="Email"
        hint="Work address"
        error="Enter a valid email"
        requiredLabel="(required)"
      >
        {(control) => <Input {...control} />}
      </FormField>,
    );
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
    const { container } = render(
      <Combobox
        aria-label="Countries"
        options={options}
        multiple
        emptyLabel="No results"
        clearLabel="Clear"
        removeLabel={(l) => `Remove ${l}`}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.type(screen.getByRole("combobox"), "be{Enter}");
    await userEvent.type(screen.getByRole("combobox"), "ger{Enter}");

    expect(onValueChange).toHaveBeenLastCalledWith(["be", "de"]);
    await expect(violations(container)).resolves.toStrictEqual([]);

    await userEvent.click(
      screen.getByRole("button", { name: "Remove Belgium" }),
    );

    expect(onValueChange).toHaveBeenLastCalledWith(["de"]);
  });

  it("single mode shows the selected label and reports no results", async () => {
    expect.hasAssertions();

    render(
      <Combobox
        aria-label="Country"
        options={options}
        defaultValue={["nl"]}
        emptyLabel="No results"
        clearLabel="Clear"
      />,
    );
    const input = screen.getByRole<HTMLInputElement>("combobox");

    expect(input.value).toBe("Netherlands");

    await userEvent.clear(input);
    await userEvent.type(input, "zzz");

    expect(screen.getByRole("status").textContent).toBe("No results");
  });
});

describe("data table", () => {
  it("reports sort changes, selects rows and selects all", async () => {
    expect.hasAssertions();

    const onSort = vi.fn<(c: string, d: string) => void>();
    const { container } = render(<TableHarness onSort={onSort} />);

    expect(
      screen
        .getByRole("columnheader", { name: "Name" })
        .getAttribute("aria-sort"),
    ).toBe("ascending");

    await userEvent.click(screen.getByRole("button", { name: "Name" }));

    expect(onSort).toHaveBeenCalledWith("name", "descending");

    await userEvent.click(screen.getByRole("checkbox", { name: "Select Ada" }));
    const all = screen.getByRole<HTMLInputElement>("checkbox", {
      name: "Select all",
    });

    expect(all.indeterminate).toBe(true);

    await userEvent.click(all);

    expect(
      screen.getByRole("checkbox", { name: "Select Grace" }),
    ).toHaveProperty("checked", true);
    await expect(violations(container)).resolves.toStrictEqual([]);
  });
});

describe("navigation", () => {
  it("pagination marks the current page, gaps and disabled ends", async () => {
    expect.hasAssertions();

    const onPageChange = vi.fn<(page: number) => void>();
    const { container } = render(
      <Pagination
        label="Pages"
        page={1}
        pageCount={10}
        onPageChange={onPageChange}
        previousLabel="Previous"
        nextLabel="Next"
        pageLabel={(n) => `Page ${String(n)}`}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toHaveProperty(
      "disabled",
      true,
    );
    expect(
      screen
        .getByRole("button", { name: "Page 1" })
        .getAttribute("aria-current"),
    ).toBe("page");

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
    render(
      <Breadcrumb
        label="Breadcrumb"
        items={items}
        maxItems={3}
        expandLabel="Show all"
      />,
    );

    expect(screen.queryByText("B")).toBeNull();
    expect(screen.getByText("E").getAttribute("aria-current")).toBe("page");

    await userEvent.click(screen.getByRole("button", { name: "Show all" }));

    expect(screen.getByText("B")).toBeInstanceOf(HTMLElement);
  });

  it("sidebar toggles collapsible groups and marks the current item", async () => {
    expect.hasAssertions();

    const { container } = render(
      <Sidebar
        label="Main"
        groups={[
          {
            id: "g",
            label: "Content",
            collapsible: true,
            items: [{ id: "a", label: "Pages", href: "/pages", current: true }],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Pages" }).getAttribute("aria-current"),
    ).toBe("page");

    await userEvent.click(screen.getByRole("button", { name: /Content/ }));

    expect(screen.queryByRole("link", { name: "Pages" })).toBeNull();
    await expect(violations(container)).resolves.toStrictEqual([]);
  });
});

describe("overlays and feedback", () => {
  it("toast announces by tone, runs the action and dismisses on timeout", async () => {
    expect.hasAssertions();

    vi.useFakeTimers();
    const onDismiss = vi.fn<(id: string) => void>();
    const onAction = vi.fn<() => void>();
    render(
      <ToastRegion
        dismissLabel="Dismiss"
        onDismiss={onDismiss}
        toasts={[
          { id: "e", tone: "danger", message: "Failed", duration: 1000 },
          { id: "s", message: "Saved", action: { label: "Undo", onAction } },
        ]}
      />,
    );

    expect(screen.getByRole("alert").textContent).toContain("Failed");
    expect(screen.getByRole("status").textContent).toContain("Saved");

    vi.advanceTimersByTime(1000);

    expect(onDismiss).toHaveBeenCalledWith("e");

    vi.useRealTimers();
    await userEvent.click(screen.getByRole("button", { name: "Undo" }));

    expect(onAction).toHaveBeenCalledWith();
  });

  it("drawer opens as a labelled dialog and closes through the close button", async () => {
    expect.hasAssertions();

    function Harness() {
      const [open, setOpen] = useState(true);
      return (
        <Drawer
          open={open}
          onOpenChange={setOpen}
          title="Edit"
          closeLabel="Close"
          side="start"
        >
          Body
        </Drawer>
      );
    }
    const { container } = render(<Harness />);

    expect(screen.getByRole("dialog", { name: "Edit" })).toBeInstanceOf(
      HTMLElement,
    );
    await expect(violations(container)).resolves.toStrictEqual([]);

    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("file upload hands over files (first only when single), lists errors and progress", async () => {
    expect.hasAssertions();

    const onFilesAdded = vi.fn<(files: File[]) => void>();
    const { container } = render(
      <FileUpload
        label="Choose a file"
        onFilesAdded={onFilesAdded}
        files={[
          { id: "1", name: "a.png", progress: 40 },
          { id: "2", name: "b.png", error: "Too large" },
        ]}
        onRemove={() => undefined}
        removeLabel={(n) => `Remove ${n}`}
      />,
    );
    const a = new File(["a"], "a.png", { type: "image/png" });
    const b = new File(["b"], "b.png", { type: "image/png" });
    await userEvent.upload(screen.getByLabelText("Choose a file"), [a, b]);

    expect(onFilesAdded).toHaveBeenCalledWith([a]);
    expect(screen.getByRole("progressbar", { name: "a.png" })).toBeInstanceOf(
      HTMLElement,
    );
    expect(screen.getByText("Too large")).toBeInstanceOf(HTMLElement);
    await expect(violations(container)).resolves.toStrictEqual([]);
  });

  it("date range keeps end after start via min/max", () => {
    expect.hasAssertions();

    render(
      <DateRangePicker
        legend="Period"
        startLabel="From"
        endLabel="To"
        defaultValue={{ start: "2026-11-01", end: "2026-11-10" }}
      />,
    );

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
    const { container } = render(
      <DatePicker
        aria-label="Start"
        defaultValue="2026-11-04"
        min="2026-11-02"
        locale="en"
        onValueChange={onValueChange}
        calendar={{
          openLabel: (field) => `Choose ${field}`,
          previousMonthLabel: "Previous month",
          nextMonthLabel: "Next month",
        }}
      />,
    );
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
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Choose Start" }),
    );
  });
});

describe("split button", () => {
  it("runs the main action, opens the menu with the keyboard and selects", async () => {
    expect.hasAssertions();

    const onClick = vi.fn<() => void>();
    const onSelect = vi.fn<(id: string) => void>();
    const { container } = render(
      <SplitButton
        variant="primary"
        onClick={onClick}
        onSelect={onSelect}
        menuLabel="More publish options"
        items={[
          { id: "draft", label: "Save draft" },
          { id: "schedule", label: "Schedule", disabled: true },
          { id: "unpublish", label: "Unpublish" },
        ]}
      >
        Publish changes
      </SplitButton>,
    );
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

  it("disables both parts together or each part alone", () => {
    expect.hasAssertions();

    render(
      <>
        <SplitButton
          onClick={vi.fn<() => void>()}
          onSelect={vi.fn<(id: string) => void>()}
          menuLabel="Menu all"
          items={[]}
          disabled
        >
          All
        </SplitButton>
        <SplitButton
          onClick={vi.fn<() => void>()}
          onSelect={vi.fn<(id: string) => void>()}
          menuLabel="Menu one"
          items={[]}
          menuDisabled
        >
          One
        </SplitButton>
      </>,
    );

    expect(screen.getByRole("button", { name: "All" })).toHaveProperty(
      "disabled",
      true,
    );
    expect(screen.getByRole("button", { name: "Menu all" })).toHaveProperty(
      "disabled",
      true,
    );
    expect(screen.getByRole("button", { name: "One" })).toHaveProperty(
      "disabled",
      false,
    );
    expect(screen.getByRole("button", { name: "Menu one" })).toHaveProperty(
      "disabled",
      true,
    );
  });

  it("button group is a named group", () => {
    expect.hasAssertions();

    render(
      <ButtonGroup label="View">
        <button type="button" className="m-button">
          List
        </button>
        <button type="button" className="m-button">
          Grid
        </button>
      </ButtonGroup>,
    );

    expect(screen.getByRole("group", { name: "View" }).children).toHaveLength(
      2,
    );
  });
});
