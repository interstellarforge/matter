import { render, screen } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  BarChart,
  ColorSwatches,
  NumberStepper,
  ScoreRing,
  Slider,
} from "../src/index.ts";
import { violations } from "./axe.ts";
import PulsarHarness from "./PulsarHarness.svelte";

describe("score ring and bar chart", () => {
  it("score ring is a meter with a spoken percentage", async () => {
    expect.hasAssertions();

    const { container } = render(ScoreRing, { label: "Match", value: 94 });
    const meter = screen.getByRole("meter", { name: "Match" });

    expect(meter.getAttribute("aria-valuetext")).toBe("94%");
    await expect(violations(container)).resolves.toStrictEqual([]);
  });

  it("bar chart exposes every bar as text with its value", async () => {
    expect.hasAssertions();

    const { container } = render(BarChart, {
      label: "New vacancies",
      data: [
        { label: "Mon", value: 4 },
        { label: "Tue", value: 9, valueLabel: "9 vacancies" },
      ],
    });

    expect(screen.getByText("Mon: 4")).toBeTruthy();
    expect(screen.getByText("Tue: 9 vacancies")).toBeTruthy();
    await expect(violations(container)).resolves.toStrictEqual([]);
  });
});

describe("stat card, sortable list and kanban board", () => {
  it("renders the stat card without accessibility violations", async () => {
    expect.hasAssertions();

    const { container } = render(PulsarHarness, {
      onReorder: vi.fn(),
      onMove: vi.fn(),
    });

    expect(screen.getByText("Open roles")).toBeTruthy();
    await expect(violations(container)).resolves.toStrictEqual([]);
  });

  it("moves a sortable item with the arrow keys and announces it", async () => {
    expect.hasAssertions();

    const onReorder = vi.fn<(ids: string[]) => void>();
    render(PulsarHarness, { onReorder, onMove: vi.fn() });
    screen.getByRole("button", { name: "Move Ada" }).focus();
    await userEvent.keyboard("{ArrowDown}");

    expect(onReorder).toHaveBeenCalledWith(["b", "a", "c"]);
    expect(
      screen
        .getAllByRole("status")
        .some((el) => el.textContent === "Ada, 2 of 3"),
    ).toBe(true);
  });

  it("moves a kanban card to the next column with ArrowRight", async () => {
    expect.hasAssertions();

    const onMove = vi.fn();
    render(PulsarHarness, { onReorder: vi.fn(), onMove });
    screen.getByRole("button", { name: "Move Grace card" }).focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(onMove).toHaveBeenCalledWith({
      id: "b",
      fromColumn: "todo",
      toColumn: "done",
      index: 1,
    });
    expect(screen.getByRole("region", { name: /To do/ })).toBeTruthy();
  });
});

describe("color swatches, slider and number stepper", () => {
  it("swatches select with the arrow keys like a radio group", async () => {
    expect.hasAssertions();

    const onValueChange = vi.fn();
    const { container } = render(ColorSwatches, {
      label: "Accent colour",
      options: [
        { value: "blue", label: "Blue", color: "#2563eb" },
        { value: "teal", label: "Teal", color: "#0d9488" },
      ],
      value: "blue",
      onValueChange,
    });
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenCalledWith("teal");
    await expect(violations(container)).resolves.toStrictEqual([]);
  });

  it("slider reports changes and exposes a spoken value", async () => {
    expect.hasAssertions();

    const onValueChange = vi.fn();
    const { container } = render(Slider, {
      "aria-label": "Line spacing",
      value: 40,
      valueText: (n: number) => `${String(n)} percent`,
      onValueChange,
    });
    const slider = screen.getByRole<HTMLInputElement>("slider", {
      name: "Line spacing",
    });
    slider.value = "50";
    slider.dispatchEvent(new Event("input", { bubbles: true }));

    expect(onValueChange).toHaveBeenCalledWith(50);
    await expect(violations(container)).resolves.toStrictEqual([]);
  });

  it("stepper steps by the step size and disables the button at the limit", async () => {
    expect.hasAssertions();

    const onValueChange = vi.fn();
    const { container } = render(NumberStepper, {
      "aria-label": "Font size",
      value: 10,
      min: 9,
      max: 11,
      step: 0.5,
      unit: "pt",
      decrementLabel: "Smaller",
      incrementLabel: "Larger",
      onValueChange,
    });
    await userEvent.click(screen.getByRole("button", { name: "Larger" }));
    await userEvent.click(screen.getByRole("button", { name: "Larger" }));

    expect(onValueChange).toHaveBeenNthCalledWith(1, 10.5);
    expect(onValueChange).toHaveBeenNthCalledWith(2, 11);
    expect(screen.getByRole("button", { name: "Larger" })).toHaveProperty(
      "disabled",
      true,
    );
    await expect(violations(container)).resolves.toStrictEqual([]);
  });
});
