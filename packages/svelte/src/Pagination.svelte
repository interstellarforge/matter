<script lang="ts">
  interface Props {
    /** Accessible name of the nav landmark. */
    label: string;
    /** Current page, 1-based. */
    page: number;
    pageCount: number;
    onPageChange: (page: number) => void;
    previousLabel: string;
    nextLabel: string;
    /** Accessible name of a page button, e.g. `(n) => "Page " + n`. */
    pageLabel: (page: number) => string;
    /** Previous/next only. */
    compact?: boolean;
    /** Optional page-size selector. */
    pageSize?: number;
    pageSizes?: number[];
    onPageSizeChange?: (size: number) => void;
    pageSizeLabel?: string;
    class?: string;
  }

  let {
    label,
    page,
    pageCount,
    onPageChange,
    previousLabel,
    nextLabel,
    pageLabel,
    compact = false,
    pageSize,
    pageSizes,
    onPageSizeChange,
    pageSizeLabel,
    class: className,
  }: Props = $props();

  /** First, last, current and neighbours; `undefined` marks a gap. */
  const pages = $derived.by(() => {
    const sorted = [...new Set([1, pageCount, page - 1, page, page + 1])]
      .filter((n) => n >= 1 && n <= pageCount)
      .sort((a, b) => a - b);
    return sorted.flatMap((n, index) =>
      index > 0 && n - (sorted[index - 1] ?? 0) > 1 ? [undefined, n] : [n],
    );
  });
</script>

<nav class={["m-pagination", className]} aria-label={label} data-compact={compact ? "" : undefined}>
  <ul>
    <li>
      <button type="button" class="m-button" disabled={page <= 1} onclick={() => { onPageChange(page - 1); }}>
        {previousLabel}
      </button>
    </li>
    {#each pages as n, index (n ?? `gap-${String(index)}`)}
      <li>
        {#if n === undefined}
          <span class="m-pagination__gap" aria-hidden="true">…</span>
        {:else}
          <button
            type="button"
            class="m-button"
            aria-label={pageLabel(n)}
            aria-current={n === page ? "page" : undefined}
            onclick={() => { onPageChange(n); }}
          >
            {n}
          </button>
        {/if}
      </li>
    {/each}
    <li>
      <button type="button" class="m-button" disabled={page >= pageCount} onclick={() => { onPageChange(page + 1); }}>
        {nextLabel}
      </button>
    </li>
  </ul>
  {#if pageSizes && pageSize !== undefined && pageSizeLabel}
    <select
      class="m-input m-select"
      aria-label={pageSizeLabel}
      value={pageSize}
      onchange={(event) => onPageSizeChange?.(Number(event.currentTarget.value))}
    >
      {#each pageSizes as size (size)}
        <option value={size} selected={size === pageSize}>{size}</option>
      {/each}
    </select>
  {/if}
</nav>
