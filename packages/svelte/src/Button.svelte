<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  import type { ButtonVariant, ControlSize } from "./types.ts";

  interface Props extends HTMLButtonAttributes {
    variant?: ButtonVariant;
    size?: ControlSize;
    /** Keeps the button focusable but blocks clicks while pending. */
    loading?: boolean;
    children?: Snippet;
  }

  let {
    variant = "secondary",
    size = "md",
    type = "button",
    loading = false,
    class: className,
    onclick,
    children,
    ...rest
  }: Props = $props();
</script>

<button
  {...rest}
  {type}
  class={["m-button", className]}
  data-variant={variant}
  data-size={size}
  aria-busy={loading ? true : undefined}
  aria-disabled={loading ? true : undefined}
  onclick={(event) => {
    if (loading) {
      event.preventDefault();
    } else {
      onclick?.(event);
    }
  }}
>
  {@render children?.()}
</button>
