<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLInputAttributes, "type" | "value"> {
    invalid?: boolean;
    indeterminate?: boolean;
    children?: Snippet;
  }

  let {
    invalid = false,
    indeterminate = false,
    checked = $bindable(false),
    class: className,
    children,
    ...rest
  }: Props = $props();
</script>

<label class={["m-checkbox", className]}>
  <input
    {...rest}
    type="checkbox"
    bind:checked
    {indeterminate}
    aria-invalid={invalid ? true : undefined}
  />
  <span>{@render children?.()}</span>
</label>
