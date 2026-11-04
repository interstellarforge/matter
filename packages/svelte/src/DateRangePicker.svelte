<script lang="ts">
  import DatePicker from "./DatePicker.svelte";
  import type { CalendarLabels, DateRange } from "./types.ts";

  interface Props {
    /** Group name (rendered as legend). */
    legend: string;
    startLabel: string;
    endLabel: string;
    type?: "date" | "datetime-local";
    value?: DateRange;
    min?: string;
    max?: string;
    invalid?: boolean;
    calendar?: CalendarLabels;
    locale?: string;
    weekStart?: 0 | 1;
  }

  let {
    legend,
    startLabel,
    endLabel,
    type = "date",
    value = $bindable({ start: "", end: "" }),
    min,
    max,
    invalid = false,
    calendar,
    locale,
    weekStart = 1,
  }: Props = $props();
</script>

<!-- The end cannot precede the start (via min/max of the other input). -->
<fieldset class="m-daterange">
  <legend>{legend}</legend>
  <DatePicker
    {type}
    aria-label={startLabel}
    {invalid}
    {calendar}
    {locale}
    {weekStart}
    {min}
    max={value.end || max}
    bind:value={value.start}
  />
  <DatePicker
    {type}
    aria-label={endLabel}
    {invalid}
    {calendar}
    {locale}
    {weekStart}
    min={value.start || min}
    {max}
    bind:value={value.end}
  />
</fieldset>
