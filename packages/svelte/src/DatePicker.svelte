<script lang="ts">
  import { calendar as calendarIcon, chevronRight } from "@interstellarforge/matter-icons";
  import { tick } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";

  import Icon from "./Icon.svelte";
  import Input from "./Input.svelte";
  import type { CalendarLabels } from "./types.ts";

  interface Props extends Omit<HTMLInputAttributes, "type" | "value"> {
    /** `date` or `datetime-local`. Value format is ISO (`2026-11-04`, `2026-11-04T09:30`). */
    type?: "date" | "datetime-local";
    value?: string;
    invalid?: boolean | undefined;
    /** Adds the calendar popover next to the native input. Omit for the plain native input. */
    calendar?: CalendarLabels | undefined;
    /** BCP 47 tag for month and weekday names; default is the browser locale. */
    locale?: string | undefined;
    /** First day of the week: 1 = Monday (default), 0 = Sunday. */
    weekStart?: 0 | 1;
    onValueChange?: (value: string) => void;
  }

  /**
   * Native date input, optionally with a calendar popover in Matter's style.
   * The input keeps typing, locale format and `min`/`max`; the calendar is a day grid (roving focus).
   */
  let {
    type = "date",
    value = $bindable(""),
    calendar,
    locale,
    weekStart = 1,
    onValueChange,
    min,
    max,
    ...rest
  }: Props = $props();

  const pad = (n: number) => String(n).padStart(2, "0");
  const toIso = (d: Date) => `${String(d.getFullYear())}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromIso = (s: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : undefined;
  };
  const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  /** Same day number in another month, clamped to the month's length. */
  function addMonths(d: Date, n: number) {
    const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    return new Date(first.getFullYear(), first.getMonth(), Math.min(d.getDate(), last));
  }

  let open = $state(false);
  let focusDay = $state(new Date());
  let wrap: HTMLSpanElement | undefined = $state();
  let toggle: HTMLButtonElement | undefined = $state();

  const selected = $derived(fromIso(value));
  const minIso = $derived(typeof min === "string" ? min.slice(0, 10) : undefined);
  const maxIso = $derived(typeof max === "string" ? max.slice(0, 10) : undefined);
  const todayIso = toIso(new Date());
  const title = $derived(new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(focusDay));
  const weekday = $derived(new Intl.DateTimeFormat(locale, { weekday: "short" }));
  const full = $derived(new Intl.DateTimeFormat(locale, { dateStyle: "full" }));
  const days = $derived.by(() => {
    const first = new Date(focusDay.getFullYear(), focusDay.getMonth(), 1);
    const start = addDays(first, -((first.getDay() - weekStart + 7) % 7));
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  });
  const weeks = $derived(Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7)));

  function commit(next: string) {
    value = next;
    onValueChange?.(next);
  }

  function isDisabled(iso: string) {
    return (minIso !== undefined && iso < minIso) || (maxIso !== undefined && iso > maxIso);
  }

  function pick(day: Date) {
    const iso = toIso(day);
    if (isDisabled(iso)) {
      return;
    }
    commit(type === "date" ? iso : `${iso}T${value.split("T")[1] ?? "00:00"}`);
    open = false;
    toggle?.focus();
  }

  async function move(day: Date) {
    focusDay = day;
    await tick();
    wrap?.querySelector<HTMLButtonElement>(".m-calendar__day[tabindex='0']")?.focus();
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
      void move(next);
    }
  }
</script>

{#snippet input()}
  <Input
    {...rest}
    {type}
    {min}
    {max}
    bind:value
    oninput={(event: Event & { currentTarget: HTMLInputElement }) => {
      onValueChange?.(event.currentTarget.value);
      (rest.oninput as ((e: Event) => void) | null | undefined)?.(event);
    }}
  />
{/snippet}

{#if !calendar}
  {@render input()}
{:else}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <span
    bind:this={wrap}
    class="m-datepicker"
    onfocusout={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        open = false;
      }
    }}
    onkeydown={(event) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        open = false;
        toggle?.focus();
      }
    }}
  >
    {@render input()}
    <button
      bind:this={toggle}
      type="button"
      class="m-datepicker__toggle"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={calendar.openLabel(rest["aria-label"] ?? "")}
      disabled={rest.disabled}
      onclick={() => {
        if (!open) {
          open = true;
          void move(selected ?? new Date());
        } else {
          open = false;
        }
      }}
    >
      <Icon icon={calendarIcon} />
    </button>
    <div class="m-calendar" role="dialog" aria-label={title} hidden={!open}>
      <div class="m-calendar__header">
        <button
          type="button"
          class="m-calendar__nav"
          data-dir="prev"
          aria-label={calendar.previousMonthLabel}
          onclick={() => (focusDay = addMonths(focusDay, -1))}
        >
          <Icon icon={chevronRight} />
        </button>
        <div class="m-calendar__title" aria-live="polite">{title}</div>
        <button
          type="button"
          class="m-calendar__nav"
          aria-label={calendar.nextMonthLabel}
          onclick={() => (focusDay = addMonths(focusDay, 1))}
        >
          <Icon icon={chevronRight} />
        </button>
      </div>
      <table role="grid" aria-label={title} onkeydown={onGridKeyDown}>
        <thead>
          <tr>
            {#each days.slice(0, 7) as day (day.getDay())}
              <th scope="col">{weekday.format(day)}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each weeks as week (toIso(week[0] ?? focusDay))}
            <tr>
              {#each week as day (toIso(day))}
                {@const iso = toIso(day)}
                <td role="gridcell" aria-selected={selected ? toIso(selected) === iso : false}>
                  <button
                    type="button"
                    class="m-calendar__day"
                    tabindex={iso === toIso(focusDay) ? 0 : -1}
                    aria-label={full.format(day)}
                    aria-disabled={isDisabled(iso) ? true : undefined}
                    data-outside={day.getMonth() === focusDay.getMonth() ? undefined : ""}
                    data-today={iso === todayIso ? "" : undefined}
                    onclick={() => {
              pick(day);
            }}
                  >
                    {day.getDate()}
                  </button>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
      {#if calendar.todayLabel}
        <div class="m-calendar__footer">
          <button
            type="button"
            class="m-button"
            data-variant="ghost"
            data-size="sm"
            onclick={() => {
              pick(new Date());
            }}
          >
            {calendar.todayLabel}
          </button>
        </div>
      {/if}
    </div>
  </span>
{/if}
