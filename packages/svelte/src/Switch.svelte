<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLButtonAttributes, "role" | "value"> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }

  /** Needs an accessible name via `aria-label` or `aria-labelledby`. */
  let {
    checked = $bindable(false),
    onCheckedChange,
    class: className,
    onclick,
    ...rest
  }: Props = $props();
</script>

<button
  {...rest}
  type="button"
  role="switch"
  aria-checked={checked}
  class={["m-switch", className]}
  onclick={(event) => {
    onclick?.(event);
    if (event.defaultPrevented) {
      return;
    }
    checked = !checked;
    onCheckedChange?.(checked);
  }}
></button>
