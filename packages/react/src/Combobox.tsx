"use client";

import type { KeyboardEvent } from "react";
import { useId, useState } from "react";

import { cx } from "./cx.ts";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  /** Accessible name of the input (or use `id` with a `<label for>` / FormField). */
  "aria-label"?: string;
  id?: string;
  "aria-describedby"?: string;
  invalid?: boolean;
  required?: boolean;
  placeholder?: string;
  /** Several values, shown as tags. */
  multiple?: boolean;
  /** Selected values; at most one in single mode. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Async: called on every input change. Set `filter={false}` to skip local filtering. */
  onQueryChange?: (query: string) => void;
  filter?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  emptyLabel: string;
  clearLabel: string;
  /** Accessible name of a tag's remove button, e.g. `(label) => "Remove " + label`. */
  removeLabel?: (label: string) => string;
  disabled?: boolean;
  className?: string;
}

export function Combobox({
  options,
  multiple,
  value,
  defaultValue,
  onValueChange,
  onQueryChange,
  filter = true,
  loading,
  loadingLabel,
  emptyLabel,
  clearLabel,
  removeLabel,
  placeholder,
  invalid,
  disabled,
  className,
  ...rest
}: ComboboxProps) {
  const base = useId();
  const [internal, setInternal] = useState(defaultValue ?? []);
  const [query, setQuery] = useState<string>();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const values = value ?? internal;
  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;
  const text = query ?? (multiple ? "" : labelOf(values[0] ?? ""));
  const shown =
    filter && query
      ? options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase()),
        )
      : options;
  const showList = open && shown.length > 0;
  const activeOption = showList
    ? shown[Math.min(active, shown.length - 1)]
    : undefined;

  function commit(next: string[]) {
    setInternal(next);
    onValueChange?.(next);
  }

  function pick(option: ComboboxOption) {
    if (option.disabled) {
      return;
    }
    if (multiple) {
      commit(
        values.includes(option.value)
          ? values.filter((v) => v !== option.value)
          : [...values, option.value],
      );
      setQuery("");
      onQueryChange?.("");
    } else {
      commit([option.value]);
      setQuery(undefined);
      setOpen(false);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const step = event.key === "ArrowDown" ? 1 : shown.length - 1;
      setActive((Math.min(active, shown.length - 1) + step) % shown.length);
    } else if (event.key === "Enter" && activeOption) {
      event.preventDefault();
      pick(activeOption);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      setQuery(undefined);
    } else if (
      event.key === "Backspace" &&
      multiple &&
      !text &&
      values.length
    ) {
      commit(values.slice(0, -1));
    }
  }

  return (
    <div
      className={cx("m-combobox", className)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setQuery(undefined);
        }
      }}
    >
      <div
        className="m-input m-combobox__box"
        aria-invalid={invalid ? true : undefined}
      >
        {multiple
          ? values.map((v) => (
              <span
                key={v}
                className="m-badge m-combobox__tag"
                data-tone="accent"
              >
                {labelOf(v)}
                <button
                  type="button"
                  aria-label={removeLabel?.(labelOf(v)) ?? labelOf(v)}
                  disabled={disabled}
                  onClick={() => {
                    commit(values.filter((x) => x !== v));
                  }}
                >
                  ×
                </button>
              </span>
            ))
          : undefined}
        <input
          {...rest}
          className="m-combobox__input"
          role="combobox"
          aria-expanded={showList}
          aria-controls={`${base}-list`}
          aria-autocomplete="list"
          aria-activedescendant={
            activeOption ? `${base}-${activeOption.value}` : undefined
          }
          aria-invalid={invalid ? true : undefined}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={text}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
            onQueryChange?.(event.target.value);
          }}
          onClick={() => {
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        {values.length > 0 && !disabled ? (
          <button
            type="button"
            className="m-combobox__clear"
            aria-label={clearLabel}
            onClick={() => {
              commit([]);
              setQuery(undefined);
            }}
          >
            ×
          </button>
        ) : undefined}
      </div>
      <ul
        id={`${base}-list`}
        role="listbox"
        className="m-combobox__list"
        aria-multiselectable={multiple ? true : undefined}
        aria-label={rest["aria-label"]}
        hidden={!showList}
      >
        {shown.map((option, index) => (
          <li
            key={option.value}
            id={`${base}-${option.value}`}
            role="option"
            className="m-combobox__option"
            aria-selected={values.includes(option.value)}
            aria-disabled={option.disabled ? true : undefined}
            data-active={option === activeOption && index >= 0 ? "" : undefined}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={() => {
              pick(option);
            }}
          >
            {option.label}
          </li>
        ))}
      </ul>
      {open && (loading || shown.length === 0) ? (
        <div className="m-combobox__list m-combobox__status" role="status">
          {loading ? loadingLabel : emptyLabel}
        </div>
      ) : undefined}
    </div>
  );
}
