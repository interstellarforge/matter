import { act, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { violations } from "./axe.ts";
import {
  BarChart,
  ColorSwatches,
  KanbanBoard,
  NumberStepper,
  ScoreRing,
  Slider,
  SortableList,
  StatCard,
} from "./index.ts";

interface Person {
  id: string;
  name: string;
}
const ada: Person = { id: "a", name: "Ada" };
const grace: Person = { id: "b", name: "Grace" };
const linus: Person = { id: "c", name: "Linus" };
const people = [ada, grace, linus];

const focus = (name: string) => {
  act(() => {
    screen.getByRole("button", { name }).focus();
  });
};

describe("score ring", () => {
  it("is a meter with an accessible name and a spoken percentage", async () => {
    expect.hasAssertions();

    const { container } = render(<ScoreRing label="Match" value={94} />);
    const meter = screen.getByRole("meter", { name: "Match" });

    expect(meter.getAttribute("aria-valuenow")).toBe("94");
    expect(meter.getAttribute("aria-valuetext")).toBe("94%");
    await expect(violations(container)).resolves.toStrictEqual([]);
  });
});

describe("bar chart", () => {
  it("exposes every bar as text with its value", async () => {
    expect.hasAssertions();

    const { container } = render(
      <BarChart
        label="New vacancies"
        data={[
          { label: "Mon", value: 4 },
          { label: "Tue", value: 9, valueLabel: "9 vacancies" },
        ]}
      />,
    );

    expect(screen.getByRole("group", { name: "New vacancies" })).toBeTruthy();
    expect(screen.getByText("Mon: 4")).toBeTruthy();
    expect(screen.getByText("Tue: 9 vacancies")).toBeTruthy();
    await expect(violations(container)).resolves.toStrictEqual([]);
  });
});

describe("stat card", () => {
  it("shows label, value and supporting text", async () => {
    expect.hasAssertions();

    const { container } = render(
      <StatCard label="Open roles" value="284" description="From 4 sources" />,
    );

    expect(screen.getByText("Open roles")).toBeTruthy();
    expect(screen.getByText("284")).toBeTruthy();
    await expect(violations(container)).resolves.toStrictEqual([]);
  });
});

describe("sortable list", () => {
  it("moves an item with the arrow keys on its grip and announces it", async () => {
    expect.hasAssertions();

    const onReorder = vi.fn();
    const { container } = render(
      <SortableList
        label="Sections"
        items={people}
        renderItem={(item) => item.name}
        onReorder={onReorder}
        gripLabel={(item) => `Move ${item.name}`}
        announceMove={(item, n, total) =>
          `${item.name}, ${String(n)} of ${String(total)}`
        }
      />,
    );
    focus("Move Ada");
    await userEvent.keyboard("{ArrowDown}");

    expect(onReorder).toHaveBeenCalledWith({
      id: "a",
      from: 0,
      to: 1,
      ids: ["b", "a", "c"],
    });
    expect(screen.getByRole("status").textContent).toBe("Ada, 2 of 3");
    await expect(violations(container)).resolves.toStrictEqual([]);
  });

  it("ignores moves past the ends", async () => {
    expect.hasAssertions();

    const onReorder = vi.fn();
    render(
      <SortableList
        label="Sections"
        items={people}
        renderItem={(item) => item.name}
        onReorder={onReorder}
        gripLabel={(item) => `Move ${item.name}`}
        announceMove={() => ""}
      />,
    );
    focus("Move Ada");
    await userEvent.keyboard("{ArrowUp}");

    expect(onReorder).not.toHaveBeenCalled();
  });
});

describe("kanban board", () => {
  const columns = [
    { id: "todo", title: "To do", items: [ada, grace] },
    { id: "done", title: "Done", items: [linus] },
  ];

  it("moves a card to the next column with ArrowRight and keeps focus on it", async () => {
    expect.hasAssertions();

    const onMove = vi.fn();
    const { container } = render(
      <KanbanBoard
        label="Pipeline"
        columns={columns}
        renderCard={(item) => item.name}
        onMove={onMove}
        gripLabel={(item) => `Move ${item.name}`}
        announceMove={(item, column, n, total) =>
          `${item.name} to ${column.id}, ${String(n)} of ${String(total)}`
        }
      />,
    );
    focus("Move Grace");
    await userEvent.keyboard("{ArrowRight}");

    expect(onMove).toHaveBeenCalledWith({
      id: "b",
      fromColumn: "todo",
      toColumn: "done",
      index: 1,
    });
    expect(screen.getByRole("status").textContent).toBe(
      "Grace to done, 2 of 2",
    );
    expect(screen.getByRole("group", { name: "Pipeline" })).toBeTruthy();
    await expect(violations(container)).resolves.toStrictEqual([]);
  });

  it("names each column and counts its cards", () => {
    expect.hasAssertions();

    render(
      <KanbanBoard
        label="Pipeline"
        columns={columns}
        renderCard={(item) => item.name}
        onMove={vi.fn()}
        gripLabel={(item) => `Move ${item.name}`}
        announceMove={() => ""}
      />,
    );

    expect(screen.getByRole("region", { name: /To do/ })).toBeTruthy();
    expect(screen.getByRole("region", { name: /Done/ }).textContent).toContain(
      "1",
    );
  });
});

describe("color swatches", () => {
  const options = [
    { value: "blue", label: "Blue", color: "#2563eb" },
    { value: "teal", label: "Teal", color: "#0d9488" },
  ];

  it("selects with the arrow keys like a radio group", async () => {
    expect.hasAssertions();

    const onValueChange = vi.fn();
    const { container } = render(
      <ColorSwatches
        label="Accent colour"
        options={options}
        defaultValue="blue"
        onValueChange={onValueChange}
      />,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenCalledWith("teal");
    expect(screen.getByRole("radio", { name: "Teal" })).toHaveProperty(
      "checked",
      true,
    );
    await expect(violations(container)).resolves.toStrictEqual([]);
  });
});

describe("slider", () => {
  it("reports changes and exposes a spoken value", async () => {
    expect.hasAssertions();

    const onValueChange = vi.fn();
    const { container } = render(
      <Slider
        aria-label="Line spacing"
        defaultValue={40}
        step={10}
        valueText={(n) => `${String(n)} percent`}
        onValueChange={onValueChange}
      />,
    );
    const slider = screen.getByRole("slider", { name: "Line spacing" });
    // jsdom has no native keyboard behaviour for range inputs.
    fireEvent.change(slider, { target: { value: "50" } });

    expect(onValueChange).toHaveBeenCalledWith(50);
    expect(slider.getAttribute("aria-valuetext")).toBe("50 percent");
    await expect(violations(container)).resolves.toStrictEqual([]);
  });
});

describe("number stepper", () => {
  function Stepper({ onChange }: { onChange: (n: number) => void }) {
    const [value, setValue] = useState(10);
    return (
      <NumberStepper
        aria-label="Font size"
        value={value}
        min={9}
        max={11}
        step={0.5}
        unit="pt"
        decrementLabel="Smaller"
        incrementLabel="Larger"
        onValueChange={(n) => {
          setValue(n);
          onChange(n);
        }}
      />
    );
  }

  it("steps by the step size and disables the button at the limit", async () => {
    expect.hasAssertions();

    const onChange = vi.fn();
    const { container } = render(<Stepper onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Larger" }));
    await userEvent.click(screen.getByRole("button", { name: "Larger" }));

    expect(onChange).toHaveBeenNthCalledWith(1, 10.5);
    expect(onChange).toHaveBeenNthCalledWith(2, 11);
    expect(screen.getByRole("button", { name: "Larger" })).toHaveProperty(
      "disabled",
      true,
    );
    expect(
      screen
        .getByRole("spinbutton", { name: "Font size" })
        .getAttribute("aria-valuetext"),
    ).toBe("11 pt");
    await expect(violations(container)).resolves.toStrictEqual([]);
  });

  it("clamps typed values to the range", async () => {
    expect.hasAssertions();

    const onChange = vi.fn();
    render(<Stepper onChange={onChange} />);
    const input = screen.getByRole("spinbutton", { name: "Font size" });
    await userEvent.clear(input);
    await userEvent.type(input, "20");

    expect(onChange).toHaveBeenLastCalledWith(11);
  });
});
