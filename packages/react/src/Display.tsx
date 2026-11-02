import type { ComponentProps, ElementType } from "react";

import { cx } from "./cx.ts";

export type BadgeTone =
  "neutral" | "accent" | "info" | "success" | "warning" | "danger";

export interface BadgeProps extends ComponentProps<"span"> {
  tone?: BadgeTone;
}

/** Status must also be readable as text; never rely on the tone colour alone. */
export function Badge({ tone = "neutral", className, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={cx("m-badge", className)} data-tone={tone} />
  );
}

export interface CardProps extends ComponentProps<"div"> {
  as?: ElementType;
  padded?: boolean;
}

export function Card({
  as: Tag = "div",
  padded = false,
  className,
  ...rest
}: CardProps) {
  return (
    <Tag
      {...rest}
      className={cx("m-card", className)}
      data-padded={padded ? "" : undefined}
    />
  );
}
