<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Accessible name of the group (required). */
    label: string;
    children?: Snippet;
  }

  /** Joins buttons into one segmented control: shared radius, one border between parts. */
  let { label, class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} role="group" aria-label={label} class={["m-button-group", className]}>
  {@render children?.()}
</div>
