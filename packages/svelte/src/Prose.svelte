<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet;
  }

  /** Typography for rich text: headings, paragraphs, lists, quotes, code, links. Usable on its own for display. */
  let { class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} class={["m-prose", className]}>
  {@render children?.()}
</div>
