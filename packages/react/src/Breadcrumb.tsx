"use client";

import { useState } from "react";

export interface BreadcrumbItem {
  label: string;
  /** Omit on the last item (the current page). */
  href?: string;
}

export interface BreadcrumbProps {
  /** Accessible name of the nav landmark, e.g. "Breadcrumb". */
  label: string;
  items: BreadcrumbItem[];
  /** Collapse the middle items when there are more than this many. */
  maxItems?: number;
  /** Accessible name of the button that expands collapsed items. */
  expandLabel?: string;
}

export function Breadcrumb({
  label,
  items,
  maxItems,
  expandLabel = "…",
}: BreadcrumbProps) {
  const [expanded, setExpanded] = useState(false);
  const collapse =
    !expanded && maxItems !== undefined && items.length > maxItems;
  const visible = collapse
    ? [
        items[0],
        undefined,
        ...items.slice(items.length - Math.max(maxItems - 2, 1)),
      ]
    : items;

  return (
    <nav className="m-breadcrumb" aria-label={label}>
      <ol>
        {visible.map((item, index) => {
          if (!item) {
            return (
              <li key="more">
                <button
                  type="button"
                  className="m-breadcrumb__more"
                  aria-label={expandLabel}
                  onClick={() => {
                    setExpanded(true);
                  }}
                >
                  …
                </button>
              </li>
            );
          }
          const last = index === visible.length - 1;
          return (
            <li key={`${item.label}-${String(index)}`}>
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
