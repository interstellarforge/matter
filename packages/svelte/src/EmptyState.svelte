<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    title: string;
    children?: Snippet;
    /** Optional call to action, e.g. a `Button`. */
    action?: Snippet;
  }

  let { title, class: className, children, action, ...rest }: Props = $props();
</script>

<div {...rest} class={["m-empty", className]}>
  <div class="m-empty__title">{title}</div>
  {#if children}<div>{@render children()}</div>{/if}
  {@render action?.()}
</div>
