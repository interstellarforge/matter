<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import type { ColorSwatchOption } from "./types.ts";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /** Accessible name of the group (required). */
    label: string;
    options: ColorSwatchOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    name?: string;
    disabled?: boolean;
  }

  /** Native radios: Tab enters the group, arrow keys move and select. */
  let {
    label,
    options,
    value = $bindable(),
    onValueChange,
    name,
    disabled = false,
    class: className,
    ...rest
  }: Props = $props();

  const fallback = $props.id();
</script>

<div {...rest} class={["m-swatches", className]} role="radiogroup" aria-label={label}>
  {#each options as option (option.value)}
    <label class="m-swatch" title={option.label}>
      <input
        type="radio"
        name={name ?? fallback}
        value={option.value}
        aria-label={option.label}
        checked={value === option.value}
        {disabled}
        onchange={() => {
          value = option.value;
          onValueChange?.(option.value);
        }}
      />
      <span class="m-swatch__chip" style={`--m-swatch:${option.color}`}></span>
    </label>
  {/each}
</div>
