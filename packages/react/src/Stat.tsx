import type { ComponentProps, ReactNode } from "react";

import { cx } from "./cx.ts";

export interface StatCardProps extends Omit<ComponentProps<"div">, "title"> {
  label: ReactNode;
  value: ReactNode;
  /** Decorative icon, e.g. `<Icon icon={search} />`. */
  icon?: ReactNode;
  /** Next to the value: a trend or a `Badge`. */
  aside?: ReactNode;
  /** Supporting text under the value. */
  description?: ReactNode;
}

export function StatCard({
  label,
  value,
  icon,
  aside,
  description,
  className,
  ...rest
}: StatCardProps) {
  return (
    <div {...rest} className={cx("m-card", "m-stat", className)}>
      <div className="m-stat__head">
        <p className="m-stat__label">{label}</p>
        {icon ? (
          <span className="m-stat__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="m-stat__body">
        <p className="m-stat__value">{value}</p>
        {aside}
      </div>
      {description ? <p className="m-stat__text">{description}</p> : null}
    </div>
  );
}
