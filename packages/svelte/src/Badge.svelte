<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import type { BadgeTone } from "./types.ts";

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    tone?: BadgeTone;
    children?: Snippet;
  }

  /** Status must also be readable as text; never rely on the tone colour alone. */
  let { tone = "neutral", class: className, children, ...rest }: Props = $props();
</script>

<span {...rest} class={["m-badge", className]} data-tone={tone}>
  {@render children?.()}
</span>
