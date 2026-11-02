<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLElement> {
    /** Element to render; default `div`. */
    as?: string;
    padded?: boolean;
    children?: Snippet;
  }

  let {
    as: tag = "div",
    padded = false,
    class: className,
    children,
    ...rest
  }: Props = $props();
</script>

<svelte:element
  this={tag}
  {...rest}
  class={["m-card", className]}
  data-padded={padded ? "" : undefined}
>
  {@render children?.()}
</svelte:element>
