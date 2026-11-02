<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /** Accessible name (required). */
    label: string;
    /** Omit for an indeterminate bar. */
    value?: number;
    max?: number;
  }

  let { label, value, max = 100, class: className, style, ...rest }: Props = $props();

  const percent = $derived(
    value === undefined ? undefined : Math.min(100, Math.max(0, (value / max) * 100)),
  );
</script>

<div
  {...rest}
  class={["m-progress", className]}
  role="progressbar"
  aria-label={label}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-valuenow={value}
  style={percent === undefined ? style : `${style ?? ""};--m-progress:${String(percent)}%`}
>
  <div class="m-progress__bar"></div>
</div>
