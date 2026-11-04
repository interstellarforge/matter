import type { IconDefinition } from "@interstellarforge/matter-icons";
import type { ComponentProps } from "react";

import { cx } from "./cx.ts";
import { Icon } from "./Icon.tsx";

interface FieldProps {
  /** Sets `aria-invalid` and the error border. */
  invalid?: boolean | undefined;
}

export interface InputProps extends ComponentProps<"input">, FieldProps {
  /** Decorative leading icon, e.g. `search`. The input still needs its own accessible name. */
  icon?: IconDefinition;
}

export function Input({ invalid, icon, className, ...rest }: InputProps) {
  const input = (
    <input
      {...rest}
      className={cx("m-input", icon ? undefined : className)}
      aria-invalid={invalid ? true : undefined}
    />
  );
  return icon ? (
    <span className={cx("m-input-icon", className)}>
      <Icon icon={icon} />
      {input}
    </span>
  ) : (
    input
  );
}

export interface TextareaProps extends ComponentProps<"textarea">, FieldProps {}

export function Textarea({ invalid, className, ...rest }: TextareaProps) {
  return (
    <textarea
      {...rest}
      className={cx("m-input m-textarea", className)}
      aria-invalid={invalid ? true : undefined}
    />
  );
}

export interface SelectProps extends ComponentProps<"select">, FieldProps {}

export function Select({ invalid, className, ...rest }: SelectProps) {
  return (
    <select
      {...rest}
      className={cx("m-input m-select", className)}
      aria-invalid={invalid ? true : undefined}
    />
  );
}
