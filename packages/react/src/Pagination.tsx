import { cx } from "./cx.ts";
import { Select } from "./Fields.tsx";

export interface PaginationProps {
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
  className?: string;
}

/** First, last, current and neighbours; `undefined` marks a gap. */
function windowed(page: number, count: number): (number | undefined)[] {
  const wanted = new Set([1, count, page - 1, page, page + 1]);
  const pages = [...wanted]
    .filter((n) => n >= 1 && n <= count)
    .sort((a, b) => a - b);
  return pages.flatMap((n, index) =>
    index > 0 && n - (pages[index - 1] ?? 0) > 1 ? [undefined, n] : [n],
  );
}

export function Pagination({
  label,
  page,
  pageCount,
  onPageChange,
  previousLabel,
  nextLabel,
  pageLabel,
  compact,
  pageSize,
  pageSizes,
  onPageSizeChange,
  pageSizeLabel,
  className,
}: PaginationProps) {
  return (
    <nav
      className={cx("m-pagination", className)}
      aria-label={label}
      data-compact={compact ? "" : undefined}
    >
      <ul>
        <li>
          <button
            type="button"
            className="m-button"
            disabled={page <= 1}
            onClick={() => {
              onPageChange(page - 1);
            }}
          >
            {previousLabel}
          </button>
        </li>
        {windowed(page, pageCount).map((n, index) => (
          <li key={n ?? `gap-${String(index)}`}>
            {n === undefined ? (
              <span className="m-pagination__gap" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                type="button"
                className="m-button"
                aria-label={pageLabel(n)}
                aria-current={n === page ? "page" : undefined}
                onClick={() => {
                  onPageChange(n);
                }}
              >
                {n}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            type="button"
            className="m-button"
            disabled={page >= pageCount}
            onClick={() => {
              onPageChange(page + 1);
            }}
          >
            {nextLabel}
          </button>
        </li>
      </ul>
      {pageSizes && pageSize !== undefined && pageSizeLabel ? (
        <Select
          aria-label={pageSizeLabel}
          value={pageSize}
          onChange={(event) => {
            onPageSizeChange?.(Number(event.target.value));
          }}
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      ) : undefined}
    </nav>
  );
}
