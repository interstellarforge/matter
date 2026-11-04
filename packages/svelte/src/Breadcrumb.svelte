<script lang="ts">
  import type { BreadcrumbItem } from "./types.ts";

  interface Props {
    /** Accessible name of the nav landmark, e.g. "Breadcrumb". */
    label: string;
    items: BreadcrumbItem[];
    /** Collapse the middle items when there are more than this many. */
    maxItems?: number;
    /** Accessible name of the button that expands collapsed items. */
    expandLabel?: string;
  }

  let { label, items, maxItems, expandLabel = "…" }: Props = $props();

  let expanded = $state(false);
  const collapse = $derived(!expanded && maxItems !== undefined && items.length > maxItems);
  const visible = $derived<(BreadcrumbItem | undefined)[]>(
    collapse
      ? [items[0], undefined, ...items.slice(items.length - Math.max((maxItems ?? 0) - 2, 1))]
      : items,
  );
</script>

<nav class="m-breadcrumb" aria-label={label}>
  <ol>
    {#each visible as item, index (index)}
      <li>
        {#if !item}
          <button type="button" class="m-breadcrumb__more" aria-label={expandLabel} onclick={() => (expanded = true)}>
            …
          </button>
        {:else if index === visible.length - 1 || !item.href}
          <span aria-current={index === visible.length - 1 ? "page" : undefined}>{item.label}</span>
        {:else}
          <a href={item.href}>{item.label}</a>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
