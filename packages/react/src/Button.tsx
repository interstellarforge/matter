import type { ComponentProps } from "react";

import { cx } from "./cx.ts";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ControlSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ControlSize;
  /** Keeps the button focusable but blocks clicks while pending. */
  loading?: boolean;
}

export function Button({
  variant = "secondary",
  size = "md",
  type = "button",
  loading = false,
  className,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={cx("m-button", className)}
      data-variant={variant}
      data-size={size}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={
        loading
          ? (event) => {
              event.preventDefault();
            }
          : onClick
      }
    />
  );
}

export interface IconButtonProps extends Omit<ButtonProps, "aria-label"> {
  /** Accessible name; required because the button has no visible text. */
  label: string;
}

export function IconButton({ label, ...rest }: IconButtonProps) {
  return <Button {...rest} aria-label={label} data-icon-only="" />;
}

export interface ButtonGroupProps extends ComponentProps<"div"> {
  /** Accessible name of the group (required). */
  label: string;
}

/** Joins buttons into one segmented control: shared radius, one border between parts. */
export function ButtonGroup({ label, className, ...rest }: ButtonGroupProps) {
  return (
    <div
      {...rest}
      role="group"
      aria-label={label}
      className={cx("m-button-group", className)}
    />
  );
}
