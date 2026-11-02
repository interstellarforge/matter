<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLInputAttributes, "value"> {
    value?: string;
    /** Sets `aria-invalid` and the error border. */
    invalid?: boolean;
  }

  let {
    invalid = false,
    value = $bindable(),
    class: className,
    ...rest
  }: Props = $props();
</script>

<input
  {...rest}
  bind:value
  class={["m-input", className]}
  aria-invalid={invalid ? true : undefined}
/>
