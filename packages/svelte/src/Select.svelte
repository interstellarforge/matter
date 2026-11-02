<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLSelectAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLSelectAttributes, "value"> {
    value?: string;
    invalid?: boolean;
    children?: Snippet;
  }

  let {
    invalid = false,
    value = $bindable(),
    class: className,
    children,
    ...rest
  }: Props = $props();
</script>

<select
  {...rest}
  bind:value
  class={["m-input m-select", className]}
  aria-invalid={invalid ? true : undefined}
>
  {@render children?.()}
</select>
