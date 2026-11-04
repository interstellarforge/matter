<script lang="ts" generics="Row extends { id: string }">
  import type { Snippet } from "svelte";

  import Checkbox from "./Checkbox.svelte";
  import type { DataTableColumn, DataTableSort } from "./types.ts";

  interface Props {
    /** Accessible name of the table (visually hidden). */
    caption: string;
    columns: DataTableColumn[];
    rows: Row[];
    /** Renders one cell. */
    cell: Snippet<[Row, DataTableColumn]>;
    /** Controlled sort; the app sorts `rows`. */
    sort?: DataTableSort;
    onSortChange?: (sort: DataTableSort) => void;
    /** Controlled selection (row ids). Passing `onSelectedChange` adds a checkbox column. */
    selected?: string[];
    onSelectedChange?: (selected: string[]) => void;
    selectAllLabel?: string;
    selectRowLabel?: (row: Row) => string;
    /** CSS length; the body scrolls and the header stays sticky. */
    maxHeight?: string;
  }

  let {
    caption,
    columns,
    rows,
    cell,
    sort,
    onSortChange,
    selected = [],
    onSelectedChange,
    selectAllLabel = "",
    selectRowLabel,
    maxHeight,
  }: Props = $props();

  const allSelected = $derived(rows.length > 0 && rows.every((r) => selected.includes(r.id)));
  const someSelected = $derived(!allSelected && rows.some((r) => selected.includes(r.id)));
</script>

<div class="m-table-wrap" style={maxHeight ? `--m-table-max-h:${maxHeight}` : undefined}>
  <table class="m-table">
    <caption>{caption}</caption>
    <thead>
      <tr>
        {#if onSelectedChange}
          <th scope="col">
            <Checkbox
              aria-label={selectAllLabel}
              checked={allSelected}
              indeterminate={someSelected}
              onchange={() => { onSelectedChange(allSelected ? [] : rows.map((r) => r.id)); }}
            />
          </th>
        {/if}
        {#each columns as column (column.id)}
          {@const active = sort?.columnId === column.id ? sort : undefined}
          <th scope="col" aria-sort={column.sortable ? (active?.direction ?? "none") : undefined}>
            {#if column.sortable}
              <button
                type="button"
                class="m-table__sort"
                onclick={() =>
                  onSortChange?.({
                    columnId: column.id,
                    direction: active?.direction === "ascending" ? "descending" : "ascending",
                  })}
              >
                {column.header}
              </button>
            {:else}
              {column.header}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row (row.id)}
        {@const isSelected = selected.includes(row.id)}
        <tr data-selected={isSelected ? "" : undefined}>
          {#if onSelectedChange}
            <td>
              <Checkbox
                aria-label={selectRowLabel?.(row) ?? row.id}
                checked={isSelected}
                onchange={() => { onSelectedChange(isSelected ? selected.filter((id) => id !== row.id) : [...selected, row.id]); }}
              />
            </td>
          {/if}
          {#each columns as column (column.id)}
            <td>{@render cell(row, column)}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
