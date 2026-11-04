import type { CSSProperties, ReactNode } from "react";

import { Checkbox } from "./Controls.tsx";

export type SortDirection = "ascending" | "descending";

export interface DataTableSort {
  columnId: string;
  direction: SortDirection;
}

export interface DataTableColumn<Row> {
  id: string;
  header: ReactNode;
  sortable?: boolean;
  cell: (row: Row) => ReactNode;
}

export interface DataTableProps<Row extends { id: string }> {
  /** Accessible name of the table (visually hidden). */
  caption: string;
  columns: DataTableColumn<Row>[];
  rows: Row[];
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

export function DataTable<Row extends { id: string }>({
  caption,
  columns,
  rows,
  sort,
  onSortChange,
  selected = [],
  onSelectedChange,
  selectAllLabel = "",
  selectRowLabel,
  maxHeight,
}: DataTableProps<Row>) {
  const allSelected =
    rows.length > 0 && rows.every((r) => selected.includes(r.id));
  const someSelected =
    !allSelected && rows.some((r) => selected.includes(r.id));

  return (
    <div
      className="m-table-wrap"
      style={
        maxHeight
          ? ({ "--m-table-max-h": maxHeight } as CSSProperties)
          : undefined
      }
    >
      <table className="m-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {onSelectedChange ? (
              <th scope="col">
                <Checkbox
                  aria-label={selectAllLabel}
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={() => {
                    onSelectedChange(allSelected ? [] : rows.map((r) => r.id));
                  }}
                />
              </th>
            ) : undefined}
            {columns.map((column) => {
              const active = sort?.columnId === column.id ? sort : undefined;
              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={
                    column.sortable ? (active?.direction ?? "none") : undefined
                  }
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="m-table__sort"
                      onClick={() => {
                        onSortChange?.({
                          columnId: column.id,
                          direction:
                            active?.direction === "ascending"
                              ? "descending"
                              : "ascending",
                        });
                      }}
                    >
                      {column.header}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isSelected = selected.includes(row.id);
            return (
              <tr key={row.id} data-selected={isSelected ? "" : undefined}>
                {onSelectedChange ? (
                  <td>
                    <Checkbox
                      aria-label={selectRowLabel?.(row) ?? row.id}
                      checked={isSelected}
                      onChange={() => {
                        onSelectedChange(
                          isSelected
                            ? selected.filter((id) => id !== row.id)
                            : [...selected, row.id],
                        );
                      }}
                    />
                  </td>
                ) : undefined}
                {columns.map((column) => (
                  <td key={column.id}>{column.cell(row)}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
