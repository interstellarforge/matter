"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";

export interface MenuItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface MenuProps {
  /** Visible text of the trigger button. */
  triggerLabel: string;
  items: MenuItem[];
  onSelect: (id: string) => void;
}

export function Menu({ triggerLabel, items, onSelect }: MenuProps) {
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
      return;
    }
    if (event.key.length === 1) {
      const typed = event.key.toLowerCase();
      focusItem(
        enabled.find(
          (index) =>
            index > current &&
            items[index]?.label.toLowerCase().startsWith(typed),
        ) ??
          enabled.find((index) =>
            items[index]?.label.toLowerCase().startsWith(typed),
          ),
      );
    }
  }

  return (
    <div ref={root} className="m-menu-wrap">
      <button
        ref={trigger}
        type="button"
        className="m-button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
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
        {triggerLabel}
      </button>
      <div
        id={menuId}
        role="menu"
        className="m-menu"
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
