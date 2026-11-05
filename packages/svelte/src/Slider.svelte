<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLInputAttributes, "type" | "value" | "children"> {
    value?: number;
    onValueChange?: (value: number) => void;
    /** Spoken value, e.g. `(n) => n + " px"`. */
    valueText?: (value: number) => string;
  }

  /** Needs an accessible name (`aria-label`, `aria-labelledby` or `FormField`). */
  let {
    value = $bindable(),
    onValueChange,
    valueText,
    min = 0,
    max = 100,
    class: className,
    style,
    ...rest
  }: Props = $props();

  const current = $derived(value ?? Number(min));
  const span = $derived(Number(max) - Number(min));
  const fill = $derived(span > 0 ? ((current - Number(min)) / span) * 100 : 0);
</script>

<input
  {...rest}
  type="range"
  {min}
  {max}
  value={current}
  class={["m-slider", className]}
  aria-valuetext={valueText?.(current)}
  style={`${style ?? ""};--m-slider-fill:${String(fill)}%`}
  oninput={(event) => {
    value = event.currentTarget.valueAsNumber;
    onValueChange?.(value);
  }}
/>
