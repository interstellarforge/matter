<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";

  interface Props extends HTMLTextareaAttributes {
    invalid?: boolean;
  }

  let {
    invalid = false,
    value = $bindable(),
    class: className,
    ...rest
  }: Props = $props();
</script>

<textarea
  {...rest}
  bind:value
  class={["m-input m-textarea", className]}
  aria-invalid={invalid ? true : undefined}
></textarea>
