<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import type { BarChartItem } from "./types.ts";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /** Accessible name of the chart (required). */
    label: string;
    data: BarChartItem[];
    /** Value that fills the full height; defaults to the largest value. */
    max?: number;
  }

  let { label, data, max, class: className, ...rest }: Props = $props();

  const top = $derived(max ?? Math.max(1, ...data.map((item) => item.value)));
  const percent = (value: number) => Math.min(100, Math.max(0, (value / top) * 100));
</script>

<div {...rest} class={["m-barchart", className]} role="group" aria-label={label}>
  <ul class="m-barchart__bars" role="list">
    {#each data as item (item.id ?? item.label)}
      {@const text = item.valueLabel ?? String(item.value)}
      <li class="m-barchart__bar" style={`--m-bar:${String(percent(item.value))}%`}>
        <span class="m-barchart__track" aria-hidden="true">
          <span class="m-barchart__value">{text}</span>
          <span class="m-barchart__fill"></span>
        </span>
        <span class="m-barchart__label" aria-hidden="true">{item.label}</span>
        <span class="m-sr-only">{`${item.label}: ${text}`}</span>
      </li>
    {/each}
  </ul>
</div>
