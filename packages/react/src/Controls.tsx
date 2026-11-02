"use client";

import type { ComponentProps } from "react";
import { useState } from "react";

import { cx } from "./cx.ts";

export interface CheckboxProps extends Omit<ComponentProps<"input">, "type"> {
  invalid?: boolean;
  indeterminate?: boolean;
}

/** Client component: `indeterminate` is a DOM property that needs a ref. */
export function Checkbox({
  invalid,
  indeterminate = false,
  className,
  children,
  ...rest
}: CheckboxProps) {
  return (
    <label className={cx("m-checkbox", className)}>
      <input
        {...rest}
        type="checkbox"
        aria-invalid={invalid ? true : undefined}
        ref={(element) => {
          if (element) {
            element.indeterminate = indeterminate;
          }
        }}
      />
      <span>{children}</span>
    </label>
  );
}

export interface SwitchProps extends Omit<
  ComponentProps<"button">,
  "onChange" | "role" | "value"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/** Needs an accessible name via `aria-label` or `aria-labelledby`. */
export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  className,
  onClick,
  ...rest
}: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked ?? internal;
  return (
    <button
      {...rest}
      type="button"
      role="switch"
      aria-checked={on}
      className={cx("m-switch", className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        setInternal(!on);
        onCheckedChange?.(!on);
      }}
    />
  );
}
