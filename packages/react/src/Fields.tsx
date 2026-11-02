import type { ComponentProps } from "react";

import { cx } from "./cx.ts";

interface FieldProps {
  /** Sets `aria-invalid` and the error border. */
  invalid?: boolean;
}

export interface InputProps extends ComponentProps<"input">, FieldProps {}

export function Input({ invalid, className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={cx("m-input", className)}
      aria-invalid={invalid ? true : undefined}
    />
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
