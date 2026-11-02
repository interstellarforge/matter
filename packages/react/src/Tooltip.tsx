"use client";

import type { ReactElement } from "react";
import { cloneElement, useId, useState } from "react";

export interface TooltipProps {
  content: string;
  /** The single element that triggers the tooltip; it receives `aria-describedby`. */
  children: ReactElement<{ "aria-describedby"?: string }>;
}

/** Opens on hover and focus; Esc dismisses. Placement is fixed to the top in the MVP (no collision handling). */
export function Tooltip({ content, children }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span
      className="m-tooltip-wrap"
      onMouseEnter={() => {
        setOpen(true);
      }}
      onMouseLeave={() => {
        setOpen(false);
      }}
      onFocus={() => {
        setOpen(true);
      }}
      onBlur={() => {
        setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }}
    >
      {cloneElement(children, { "aria-describedby": id })}
      <span id={id} role="tooltip" className="m-tooltip" hidden={!open}>
        {content}
      </span>
    </span>
  );
}
