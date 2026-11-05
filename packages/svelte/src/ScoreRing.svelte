<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import type { ScoreRingTone } from "./types.ts";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Accessible name (required), e.g. "Match". */
    label: string;
    value: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    tone?: ScoreRingTone;
    /** Spoken value; defaults to the rounded percentage. */
    valueText?: string;
    /** Replaces the centre text. */
    children?: Snippet;
  }

  let {
    label,
    value,
    max = 100,
    size = "md",
    tone = "accent",
    valueText,
    class: className,
    style,
    children,
    ...rest
  }: Props = $props();

  const percent = $derived(Math.min(100, Math.max(0, (value / max) * 100)));
  const text = $derived(`${String(Math.round(percent))}%`);
</script>

<div
  {...rest}
  class={["m-score-ring", className]}
  role="meter"
  aria-label={label}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-valuenow={value}
  aria-valuetext={valueText ?? text}
  data-size={size}
  data-tone={tone}
  data-empty={percent === 0 ? "" : undefined}
  style={`${style ?? ""};--m-score:${String(percent)}`}
>
  <svg class="m-score-ring__svg" viewBox="0 0 36 36" aria-hidden="true" focusable="false">
    <circle class="m-score-ring__track" cx="18" cy="18" r="16" />
    <circle class="m-score-ring__arc" cx="18" cy="18" r="16" pathLength="100" />
  </svg>
  <span class="m-score-ring__text" aria-hidden="true">
    {#if children}{@render children()}{:else}{text}{/if}
  </span>
</div>
