import type { ComponentProps, ReactNode } from "react";

import { cx } from "./cx.ts";

export interface AvatarProps extends Omit<ComponentProps<"span">, "children"> {
  /** Full name: used as the accessible name and for the initials fallback. */
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
}

export function Avatar({
  name,
  src,
  size = "md",
  className,
  ...rest
}: AvatarProps) {
  return (
    <span
      {...rest}
      className={cx("m-avatar", className)}
      data-size={size}
      role="img"
      aria-label={name}
    >
      {src ? <img src={src} alt="" /> : initials(name)}
    </span>
  );
}

export type BannerTone = "info" | "success" | "warning" | "danger";

export interface BannerProps extends Omit<ComponentProps<"div">, "title"> {
  tone?: BannerTone;
  title?: ReactNode;
}

/** Warnings and errors are announced immediately (`alert`); the rest politely (`status`). */
export function Banner({
  tone = "info",
  title,
  className,
  children,
  ...rest
}: BannerProps) {
  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      {...rest}
      className={cx("m-banner", className)}
      data-tone={tone}
    >
      {title ? <div className="m-banner__title">{title}</div> : null}
      {children}
    </div>
  );
}

export interface ProgressBarProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  /** Accessible name (required). */
  label: string;
  /** Omit for an indeterminate bar. */
  value?: number;
  max?: number;
}

export function ProgressBar({
  label,
  value,
  max = 100,
  className,
  style,
  ...rest
}: ProgressBarProps) {
  const percent =
    value === undefined
      ? undefined
      : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      {...rest}
      className={cx("m-progress", className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      style={
        percent === undefined
          ? style
          : ({
              ...style,
              "--m-progress": `${String(percent)}%`,
            } as typeof style)
      }
    >
      <div className="m-progress__bar" />
    </div>
  );
}

export interface EmptyStateProps extends Omit<ComponentProps<"div">, "title"> {
  title: ReactNode;
  /** Optional call to action, e.g. a `Button`. */
  action?: ReactNode;
}

export function EmptyState({
  title,
  action,
  className,
  children,
  ...rest
}: EmptyStateProps) {
  return (
    <div {...rest} className={cx("m-empty", className)}>
      <div className="m-empty__title">{title}</div>
      {children ? <div>{children}</div> : null}
      {action}
    </div>
  );
}
