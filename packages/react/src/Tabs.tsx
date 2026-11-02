"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useId, useRef, useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Accessible name of the tab list. */
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  items,
  label,
  value,
  defaultValue,
  onValueChange,
}: TabsProps) {
  const base = useId();
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const firstEnabled = items.find((item) => !item.disabled)?.id;
  const [internal, setInternal] = useState(defaultValue ?? firstEnabled);
  const selected = value ?? internal;
  const enabled = items.filter((item) => !item.disabled);

  function select(id: string) {
    setInternal(id);
    onValueChange?.(id);
    refs.current.get(id)?.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    const index = enabled.findIndex((item) => item.id === selected);
    const last = enabled.length - 1;
    const target = {
      ArrowRight: enabled[index === last ? 0 : index + 1],
      ArrowLeft: enabled[index <= 0 ? last : index - 1],
      Home: enabled[0],
      End: enabled[last],
    }[event.key];
    if (target) {
      event.preventDefault();
      select(target.id);
    }
  }

  return (
    <div className="m-tabs">
      <div
        role="tablist"
        aria-label={label}
        className="m-tablist"
        onKeyDown={onKeyDown}
      >
        {items.map((item) => (
          <button
            key={item.id}
            ref={(element) => {
              if (element) {
                refs.current.set(item.id, element);
              }
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${item.id}`}
            className="m-tab"
            aria-selected={item.id === selected}
            aria-controls={`${base}-panel-${item.id}`}
            tabIndex={item.id === selected ? 0 : -1}
            disabled={item.disabled}
            onClick={() => {
              select(item.id);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${base}-panel-${item.id}`}
          className="m-tabpanel"
          aria-labelledby={`${base}-tab-${item.id}`}
          hidden={item.id !== selected}
        >
          {item.id === selected ? item.content : undefined}
        </div>
      ))}
    </div>
  );
}
