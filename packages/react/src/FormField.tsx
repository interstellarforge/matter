import type { ReactNode } from "react";
import { useId } from "react";

import { cx } from "./cx.ts";

/** Props to spread onto the control (Input, Select, Textarea, Checkbox, DatePicker). */
export interface FieldControlProps {
  id: string;
  "aria-describedby"?: string | undefined;
  invalid?: boolean | undefined;
  required?: boolean | undefined;
}

export interface FormFieldProps {
  label: ReactNode;
  /** Help text under the control. */
  hint?: ReactNode;
  /** Error text; also marks the control invalid. Say what to do, not just what is wrong. */
  error?: ReactNode;
  /** Visible text marking a required field, e.g. "(required)". Also sets `required` on the control. */
  requiredLabel?: string;
  className?: string;
  children: (control: FieldControlProps) => ReactNode;
}

/** Label, control, hint and error wired together with `for` and `aria-describedby`. */
export function FormField({
  label,
  hint,
  error,
  requiredLabel,
  className,
  children,
}: FormFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : undefined, error ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cx("m-field", className)}>
      <label htmlFor={id} className="m-field__label">
        {label}
        {requiredLabel ? (
          <span className="m-field__required"> {requiredLabel}</span>
        ) : undefined}
      </label>
      {children({
        id,
        "aria-describedby": describedBy,
        invalid: error ? true : undefined,
        required: requiredLabel ? true : undefined,
      })}
      {hint ? (
        <p id={hintId} className="m-field__hint">
          {hint}
        </p>
      ) : undefined}
      {error ? (
        <p id={errorId} className="m-field__error">
          {error}
        </p>
      ) : undefined}
    </div>
  );
}
