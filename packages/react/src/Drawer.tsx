"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Visible heading; also the accessible name. */
  title: string;
  /** Accessible name of the close button. */
  closeLabel: string;
  /** Edge the panel slides from. Default `end` (right in LTR). */
  side?: "start" | "end";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  footer?: ReactNode;
}

/** Side panel on the native modal `<dialog>`: focus trap, Esc and inert background come from the platform. */
export function Drawer({
  open,
  onOpenChange,
  title,
  closeLabel,
  side = "end",
  size = "md",
  children,
  footer,
}: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="m-drawer"
      data-side={side}
      data-size={size}
      aria-labelledby={titleId}
      onClose={() => {
        onOpenChange(false);
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div className="m-dialog__header">
        <h2 id={titleId} className="m-dialog__title">
          {title}
        </h2>
        <button
          type="button"
          className="m-button"
          data-variant="ghost"
          data-icon-only=""
          aria-label={closeLabel}
          onClick={() => {
            onOpenChange(false);
          }}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="m-dialog__body">{children}</div>
      {footer ? <div className="m-dialog__footer">{footer}</div> : undefined}
    </dialog>
  );
}
