import type { IconDefinition } from "@interstellarforge/matter-icons";
import type { ComponentProps } from "react";

import { cx } from "./cx.ts";

export interface IconProps extends Omit<
  ComponentProps<"svg">,
  "children" | "dangerouslySetInnerHTML"
> {
  /** A named export of `@interstellarforge/matter-icons`, e.g. `search` (tree-shakeable). */
  icon: IconDefinition;
  size?: number;
  /** Accessible name. Without it the icon is decorative and hidden from assistive technology. */
  label?: string;
}

export function Icon({
  icon,
  size = 18,
  label,
  className,
  ...rest
}: IconProps) {
  return (
    <svg
      {...rest}
      className={cx("m-icon", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      // The body is static markup from our own, SVGO-optimised icon sources.
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
