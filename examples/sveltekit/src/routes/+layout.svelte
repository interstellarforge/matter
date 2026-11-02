<script lang="ts">
  import "@interstellarforge/matter-css/matter.css";

  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head><title>Matter · SvelteKit example</title></svelte:head>

<div class="page">{@render children()}</div>

<style>
  :global(body) {
    margin: 0;
    background: var(--m-bg);
    color: var(--m-text);
    font-family: var(--m-font-sans);
    font-size: var(--m-control-fs);
  }
  .page {
    display: grid;
    gap: var(--m-space-6);
    padding: var(--m-space-6);
    max-width: 960px;
  }
</style>
