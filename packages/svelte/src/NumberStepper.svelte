<script lang="ts">
  import { minus, plus } from "@interstellarforge/matter-icons";
  import { untrack } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";

  import Icon from "./Icon.svelte";

  interface Props extends Omit<HTMLInputAttributes, "type" | "value" | "size" | "class" | "children"> {
    value?: number;
    onValueChange?: (value: number) => void;
    /** Shown after the number, e.g. "pt". */
    unit?: string;
    decrementLabel: string;
    incrementLabel: string;
    class?: string;
  }

  /** The input is a native `type=number`; it needs an accessible name via `aria-label`. */
  let {
    value = $bindable(),
    onValueChange,
    unit,
    decrementLabel,
    incrementLabel,
    min,
    max,
    step = 1,
    disabled = false,
    class: className,
    ...rest
  }: Props = $props();

  const decimals = (n: number) => (String(n).split(".")[1] ?? "").length;
  const lo = $derived(min === undefined ? -Infinity : Number(min));
  const hi = $derived(max === undefined ? Infinity : Number(max));
  const stepBy = $derived(Number(step) > 0 ? Number(step) : 1);
  const precision = $derived(Math.max(decimals(stepBy), decimals(lo === -Infinity ? 0 : lo)));
  const clamp = (n: number) => Math.min(hi, Math.max(lo, Number(n.toFixed(precision))));

  let text = $state(untrack(() => (value === undefined ? "" : String(value))));

  // Only a changed value from outside overwrites what is being typed.
  $effect(() => {
    if (value !== undefined && value !== Number(untrack(() => text))) text = String(value);
  });

  function commit(next: number) {
    value = next;
    text = String(next);
    onValueChange?.(next);
  }

  const base = $derived(value ?? (lo === -Infinity ? 0 : lo));
</script>

<div class={["m-stepper", className]} data-disabled={disabled ? "" : undefined}>
  <button
    type="button"
    class="m-button"
    data-icon-only
    aria-label={decrementLabel}
    disabled={disabled === true || (value !== undefined && value <= lo)}
    onclick={() => {
      commit(clamp(base - stepBy));
    }}
  >
    <Icon icon={minus} />
  </button>
  <span class="m-stepper__field">
    <input
      {...rest}
      type="number"
      class="m-stepper__input"
      inputmode="decimal"
      {min}
      {max}
      {step}
      {disabled}
      value={text}
      aria-valuetext={unit && text ? `${text} ${unit}` : undefined}
      oninput={(event) => {
        const input = event.currentTarget;
        text = input.value;
        if (input.value !== "" && Number.isFinite(input.valueAsNumber)) {
          value = clamp(input.valueAsNumber);
          onValueChange?.(value);
        }
      }}
      onblur={() => {
        text = value === undefined ? "" : String(value);
      }}
    />
    {#if unit}<span class="m-stepper__unit" aria-hidden="true">{unit}</span>{/if}
  </span>
  <button
    type="button"
    class="m-button"
    data-icon-only
    aria-label={incrementLabel}
    disabled={disabled === true || (value !== undefined && value >= hi)}
    onclick={() => {
      commit(clamp(base + stepBy));
    }}
  >
    <Icon icon={plus} />
  </button>
</div>
