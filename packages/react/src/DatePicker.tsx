"use client";

import {
  calendar as calendarIcon,
  chevronRight,
} from "@interstellarforge/matter-icons";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { Input, type InputProps } from "./Fields.tsx";
import { Icon } from "./Icon.tsx";

export interface CalendarLabels {
  /** Accessible name of the button that opens the calendar; receives the input's `aria-label`. */
  openLabel: (field: string) => string;
  previousMonthLabel: string;
  nextMonthLabel: string;
  /** Shows a "today" button when set. */
  todayLabel?: string;
}

export interface DatePickerProps extends Omit<InputProps, "type" | "icon"> {
  /** `date` or `datetime-local`. Value format is ISO (`2026-11-04`, `2026-11-04T09:30`). */
  type?: "date" | "datetime-local";
  /** Adds the calendar popover next to the native input. Omit for the plain native input. */
  calendar?: CalendarLabels | undefined;
  /** BCP 47 tag for month and weekday names; default is the browser locale. */
  locale?: string | undefined;
  /** First day of the week: 1 = Monday (default), 0 = Sunday. */
  weekStart?: 0 | 1 | undefined;
  onValueChange?: (value: string) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) =>
  `${String(d.getFullYear())}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = (s: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : undefined;
};
const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
/** Same day number in another month, clamped to the month's length. */
function addMonths(d: Date, n: number) {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return new Date(
    first.getFullYear(),
    first.getMonth(),
    Math.min(d.getDate(), last),
  );
}

/**
 * Native date input, optionally with a calendar popover in Matter's style.
 * The input keeps typing, locale format and `min`/`max`; the calendar is a day grid (roving focus).
 */
export function DatePicker({
  type = "date",
  calendar,
  locale,
  weekStart = 1,
  value,
  defaultValue,
  onChange,
  onValueChange,
  min,
  max,
  ...rest
}: DatePickerProps) {
  const [internal, setInternal] = useState(
    typeof defaultValue === "string" ? defaultValue : "",
  );
  const [open, setOpen] = useState(false);
  const [focusDay, setFocusDay] = useState(new Date());
  const wrap = useRef<HTMLSpanElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);
  const current = typeof value === "string" ? value : internal;
  const selected = fromIso(current);
  const minIso = typeof min === "string" ? min.slice(0, 10) : undefined;
  const maxIso = typeof max === "string" ? max.slice(0, 10) : undefined;

  useEffect(() => {
    if (open && moveFocus.current) {
      moveFocus.current = false;
      wrap.current
        ?.querySelector<HTMLButtonElement>(".m-calendar__day[tabindex='0']")
        ?.focus();
    }
  });

  function commit(next: string) {
    setInternal(next);
    onValueChange?.(next);
  }

  function pick(day: Date) {
    const iso = toIso(day);
    if ((minIso && iso < minIso) || (maxIso && iso > maxIso)) {
      return;
    }
    commit(
      type === "date" ? iso : `${iso}T${current.split("T")[1] ?? "00:00"}`,
    );
    setOpen(false);
    toggle.current?.focus();
  }

  function move(day: Date) {
    moveFocus.current = true;
    setFocusDay(day);
  }

  function onGridKeyDown(event: KeyboardEvent) {
    const offset = (focusDay.getDay() - weekStart + 7) % 7;
    const next = {
      ArrowLeft: addDays(focusDay, -1),
      ArrowRight: addDays(focusDay, 1),
      ArrowUp: addDays(focusDay, -7),
      ArrowDown: addDays(focusDay, 7),
      Home: addDays(focusDay, -offset),
      End: addDays(focusDay, 6 - offset),
      PageUp: addMonths(focusDay, event.shiftKey ? -12 : -1),
      PageDown: addMonths(focusDay, event.shiftKey ? 12 : 1),
    }[event.key];
    if (next) {
      event.preventDefault();
      move(next);
    }
  }

  const input = (
    <Input
      {...rest}
      type={type}
      min={min}
      max={max}
      value={current}
      onChange={(event) => {
        commit(event.target.value);
        onChange?.(event);
      }}
    />
  );
  if (!calendar) {
    return input;
  }

  const first = new Date(focusDay.getFullYear(), focusDay.getMonth(), 1);
  const start = addDays(first, -((first.getDay() - weekStart + 7) % 7));
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  const todayIso = toIso(new Date());
  const title = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(focusDay);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const full = new Intl.DateTimeFormat(locale, { dateStyle: "full" });

  return (
    <span
      ref={wrap}
      className="m-datepicker"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      {input}
      <button
        ref={toggle}
        type="button"
        className="m-datepicker__toggle"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={calendar.openLabel(rest["aria-label"] ?? "")}
        disabled={rest.disabled}
        onClick={() => {
          if (!open) {
            setFocusDay(selected ?? new Date());
            moveFocus.current = true;
          }
          setOpen(!open);
        }}
      >
        <Icon icon={calendarIcon} />
      </button>
      <div
        className="m-calendar"
        role="dialog"
        aria-label={title}
        hidden={!open}
      >
        <div className="m-calendar__header">
          <button
            type="button"
            className="m-calendar__nav"
            data-dir="prev"
            aria-label={calendar.previousMonthLabel}
            onClick={() => {
              setFocusDay(addMonths(focusDay, -1));
            }}
          >
            <Icon icon={chevronRight} />
          </button>
          <div className="m-calendar__title" aria-live="polite">
            {title}
          </div>
          <button
            type="button"
            className="m-calendar__nav"
            aria-label={calendar.nextMonthLabel}
            onClick={() => {
              setFocusDay(addMonths(focusDay, 1));
            }}
          >
            <Icon icon={chevronRight} />
          </button>
        </div>
        <table role="grid" aria-label={title} onKeyDown={onGridKeyDown}>
          <thead>
            <tr>
              {days.slice(0, 7).map((day) => (
                <th key={day.getDay()} scope="col">
                  {weekday.format(day)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, week) => (
              <tr key={week}>
                {days.slice(week * 7, week * 7 + 7).map((day) => {
                  const iso = toIso(day);
                  const disabled =
                    Boolean(minIso && iso < minIso) ||
                    Boolean(maxIso && iso > maxIso);
                  return (
                    <td
                      key={iso}
                      role="gridcell"
                      aria-selected={selected ? toIso(selected) === iso : false}
                    >
                      <button
                        type="button"
                        className="m-calendar__day"
                        tabIndex={iso === toIso(focusDay) ? 0 : -1}
                        aria-label={full.format(day)}
                        aria-disabled={disabled ? true : undefined}
                        data-outside={
                          day.getMonth() === focusDay.getMonth()
                            ? undefined
                            : ""
                        }
                        data-today={iso === todayIso ? "" : undefined}
                        onClick={() => {
                          pick(day);
                        }}
                      >
                        {day.getDate()}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {calendar.todayLabel ? (
          <div className="m-calendar__footer">
            <button
              type="button"
              className="m-button"
              data-variant="ghost"
              data-size="sm"
              onClick={() => {
                pick(new Date());
              }}
            >
              {calendar.todayLabel}
            </button>
          </div>
        ) : undefined}
      </div>
    </span>
  );
}

export interface DateRange {
  start: string;
  end: string;
}

export interface DateRangePickerProps {
  /** Group name (rendered as legend). */
  legend: string;
  startLabel: string;
  endLabel: string;
  type?: "date" | "datetime-local";
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  min?: string;
  max?: string;
  invalid?: boolean;
  calendar?: CalendarLabels | undefined;
  locale?: string | undefined;
  weekStart?: 0 | 1 | undefined;
}

/** Two date inputs; the end cannot precede the start (via `min`/`max` of the other input). */
export function DateRangePicker({
  legend,
  startLabel,
  endLabel,
  type = "date",
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  invalid,
  calendar,
  locale,
  weekStart,
}: DateRangePickerProps) {
  const [internal, setInternal] = useState<DateRange>(
    defaultValue ?? { start: "", end: "" },
  );
  const range = value ?? internal;

  function update(next: DateRange) {
    setInternal(next);
    onValueChange?.(next);
  }

  const shared = { type, invalid, calendar, locale, weekStart } as const;

  return (
    <fieldset className="m-daterange">
      <legend>{legend}</legend>
      <DatePicker
        {...shared}
        aria-label={startLabel}
        min={min}
        max={range.end || max}
        value={range.start}
        onValueChange={(start) => {
          update({ ...range, start });
        }}
      />
      <DatePicker
        {...shared}
        aria-label={endLabel}
        min={range.start || min}
        max={max}
        value={range.end}
        onValueChange={(end) => {
          update({ ...range, end });
        }}
      />
    </fieldset>
  );
}
