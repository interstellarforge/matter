"use client";

import { minus, plus } from "@interstellarforge/matter-icons";
import type { ComponentProps, CSSProperties } from "react";
import { useEffect, useId, useState } from "react";

import { cx } from "./cx.ts";
import { Icon } from "./Icon.tsx";

export interface ColorSwatchOption {
  value: string;
  /** Accessible name, e.g. "Teal". */
  label: string;
  /** Any CSS colour. */
  color: string;
}

export interface ColorSwatchesProps extends Omit<
  ComponentProps<"div">,
  "onChange" | "defaultValue" | "children"
> {
  /** Accessible name of the group (required). */
  label: string;
  options: ColorSwatchOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
}

/** Native radios: Tab enters the group, arrow keys move and select. */
export function ColorSwatches({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  className,
  ...rest
}: ColorSwatchesProps) {
  const fallback = useId();
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  return (
    <div
      {...rest}
      className={cx("m-swatches", className)}
      role="radiogroup"
      aria-label={label}
    >
      {options.map((option) => (
        <label key={option.value} className="m-swatch" title={option.label}>
          <input
            type="radio"
            name={name ?? fallback}
            value={option.value}
            aria-label={option.label}
            checked={current === option.value}
            disabled={disabled}
            onChange={() => {
              setInternal(option.value);
              onValueChange?.(option.value);
            }}
          />
          <span
            className="m-swatch__chip"
            style={{ "--m-swatch": option.color } as CSSProperties}
          />
        </label>
      ))}
    </div>
  );
}

export interface SliderProps extends Omit<
  ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange" | "children"
> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Spoken value, e.g. `(n) => n + " px"`. */
  valueText?: (value: number) => string;
}

/** Needs an accessible name (`aria-label`, `aria-labelledby` or `FormField`). */
export function Slider({
  value,
  defaultValue,
  onValueChange,
  valueText,
  min = 0,
  max = 100,
  className,
  style,
  ...rest
}: SliderProps) {
  const [internal, setInternal] = useState(defaultValue ?? Number(min));
  const current = value ?? internal;
  const span = Number(max) - Number(min);
  const fill = span > 0 ? ((current - Number(min)) / span) * 100 : 0;
  return (
    <input
      {...rest}
      type="range"
      min={min}
      max={max}
      value={current}
      className={cx("m-slider", className)}
      aria-valuetext={valueText?.(current)}
      style={
        { ...style, "--m-slider-fill": `${String(fill)}%` } as CSSProperties
      }
      onChange={(event) => {
        const next = event.currentTarget.valueAsNumber;
        setInternal(next);
        onValueChange?.(next);
      }}
    />
  );
}

export interface NumberStepperProps extends Omit<
  ComponentProps<"input">,
  | "type"
  | "value"
  | "defaultValue"
  | "onChange"
  | "size"
  | "className"
  | "children"
> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Shown after the number, e.g. "pt". */
  unit?: string;
  decrementLabel: string;
  incrementLabel: string;
  className?: string;
}

const decimals = (n: number) => (String(n).split(".")[1] ?? "").length;

/** The input is a native `type=number`; it needs an accessible name via `aria-label`. */
export function NumberStepper({
  value,
  defaultValue,
  onValueChange,
  unit,
  decrementLabel,
  incrementLabel,
  min,
  max,
  step = 1,
  disabled,
  className,
  ...rest
}: NumberStepperProps) {
  const lo = min === undefined ? -Infinity : Number(min);
  const hi = max === undefined ? Infinity : Number(max);
  const stepBy = Number(step) > 0 ? Number(step) : 1;
  const precision = Math.max(
    decimals(stepBy),
    decimals(lo === -Infinity ? 0 : lo),
  );
  const clamp = (n: number) =>
    Math.min(hi, Math.max(lo, Number(n.toFixed(precision))));
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const [text, setText] = useState(
    current === undefined ? "" : String(current),
  );

  useEffect(() => {
    if (value !== undefined && value !== Number(text)) setText(String(value));
  }, [value]);

  function commit(next: number) {
    setInternal(next);
    setText(String(next));
    onValueChange?.(next);
  }

  const base = current ?? (lo === -Infinity ? 0 : lo);
  return (
    <div
      className={cx("m-stepper", className)}
      data-disabled={disabled ? "" : undefined}
    >
      <button
        type="button"
        className="m-button"
        data-icon-only
        aria-label={decrementLabel}
        disabled={disabled === true || (current !== undefined && current <= lo)}
        onClick={() => {
          commit(clamp(base - stepBy));
        }}
      >
        <Icon icon={minus} />
      </button>
      <span className="m-stepper__field">
        <input
          {...rest}
          type="number"
          className="m-stepper__input"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          value={text}
          aria-valuetext={unit && text ? `${text} ${unit}` : undefined}
          onChange={(event) => {
            const raw = event.currentTarget.value;
            setText(raw);
            if (
              raw !== "" &&
              Number.isFinite(event.currentTarget.valueAsNumber)
            ) {
              const next = clamp(event.currentTarget.valueAsNumber);
              setInternal(next);
              onValueChange?.(next);
            }
          }}
          onBlur={() => {
            if (current === undefined) setText("");
            else setText(String(current));
          }}
        />
        {unit ? (
          <span className="m-stepper__unit" aria-hidden="true">
            {unit}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        className="m-button"
        data-icon-only
        aria-label={incrementLabel}
        disabled={disabled === true || (current !== undefined && current >= hi)}
        onClick={() => {
          commit(clamp(base + stepBy));
        }}
      >
        <Icon icon={plus} />
      </button>
    </div>
  );
}
