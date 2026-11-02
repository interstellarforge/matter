<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import type { BannerTone } from "./types.ts";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    tone?: BannerTone;
    title?: string;
    children?: Snippet;
  }

  let { tone = "info", title, class: className, children, ...rest }: Props = $props();
</script>

<!-- Warnings and errors are announced immediately (alert); the rest politely (status). -->
<div
  role={tone === "danger" || tone === "warning" ? "alert" : "status"}
  {...rest}
  class={["m-banner", className]}
  data-tone={tone}
>
  {#if title}<div class="m-banner__title">{title}</div>{/if}
  {@render children?.()}
</div>
