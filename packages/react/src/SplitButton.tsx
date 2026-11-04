"use client";

import { chevronDown } from "@interstellarforge/matter-icons";
import type { KeyboardEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

import type { ControlSize } from "./Button.tsx";
import { cx } from "./cx.ts";
import { Icon } from "./Icon.tsx";
import type { MenuItem } from "./Menu.tsx";

export interface SplitButtonProps {
  /** Visible text of the main action. */
  children: ReactNode;
  /** Main action. */
  onClick: () => void;
  items: MenuItem[];
  onSelect: (id: string) => void;
  /** Accessible name of the menu trigger, e.g. "More publish options". */
  menuLabel: string;
  variant?: "primary" | "secondary";
  size?: ControlSize;
  /** Disables both parts. */
  disabled?: boolean;
  mainDisabled?: boolean;
  menuDisabled?: boolean;
  className?: string;
}

/** Main action plus a menu trigger in one control (e.g. "Publish changes" + options). */
export function SplitButton({
  children,
  onClick,
  items,
  onSelect,
  menuLabel,
  variant = "secondary",
  size = "md",
  disabled,
  mainDisabled,
  menuDisabled,
  className,
}: SplitButtonProps) {
  const menuId = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const enabled = items.flatMap((item, index) =>
    item.disabled ? [] : [index],
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  function focusItem(index: number | undefined) {
    if (index !== undefined) {
      itemRefs.current[index]?.focus();
    }
  }

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  function openAt(position: "first" | "last") {
    setOpen(true);
    queueMicrotask(() => {
      focusItem(position === "first" ? enabled[0] : enabled.at(-1));
    });
  }

  function onMenuKeyDown(event: KeyboardEvent) {
    const current = itemRefs.current.findIndex(
      (element) => element === document.activeElement,
    );
    const position = enabled.indexOf(current);
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    const next = {
      ArrowDown: enabled[(position + 1) % enabled.length],
      ArrowUp: enabled[(position - 1 + enabled.length) % enabled.length],
      Home: enabled[0],
      End: enabled.at(-1),
    }[event.key];
    if (next !== undefined) {
      event.preventDefault();
      focusItem(next);
    }
  }

  return (
    <div ref={root} className={cx("m-split", className)} data-variant={variant}>
      <button
        type="button"
        className="m-button m-split__main"
        data-variant={variant}
        data-size={size}
        disabled={disabled === true || mainDisabled === true}
        onClick={onClick}
      >
        {children}
      </button>
      <button
        ref={trigger}
        type="button"
        className="m-button m-split__trigger"
        data-variant={variant}
        data-size={size}
        aria-label={menuLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        disabled={disabled === true || menuDisabled === true}
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            openAt("first");
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openAt(event.key === "ArrowDown" ? "first" : "last");
          }
        }}
      >
        <Icon icon={chevronDown} />
      </button>
      <div
        id={menuId}
        role="menu"
        className="m-menu"
        aria-label={menuLabel}
        hidden={!open}
        onKeyDown={onMenuKeyDown}
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            type="button"
            role="menuitem"
            className="m-menu__item"
            tabIndex={-1}
            disabled={item.disabled}
            onClick={() => {
              onSelect(item.id);
              close();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
