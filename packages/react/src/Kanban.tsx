"use client";

import { drag as dragIcon } from "@interstellarforge/matter-icons";
import type {
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
} from "react";
import { useEffect, useId, useRef, useState } from "react";

import { cx } from "./cx.ts";
import { Icon } from "./Icon.tsx";

export interface KanbanItem {
  id: string;
}

export interface KanbanColumn<T extends KanbanItem> {
  id: string;
  title: ReactNode;
  /** Colour of the dot before the title. */
  tone?: "neutral" | "accent" | "info" | "success" | "warning" | "danger";
  items: T[];
}

export interface KanbanMove {
  id: string;
  fromColumn: string;
  toColumn: string;
  /** Position in the target column once the card is removed from its old place. */
  index: number;
}

export interface KanbanBoardProps<T extends KanbanItem> extends Omit<
  ComponentProps<"div">,
  "children"
> {
  /** Accessible name of the board (required). */
  label: string;
  /** The app owns the data: apply `onMove` to `columns`. */
  columns: KanbanColumn<T>[];
  renderCard: (item: T, column: KanbanColumn<T>) => ReactNode;
  /** Shown in a column without cards. */
  emptyLabel?: string;
  /** Below a column's cards, e.g. an "add" button. */
  renderFooter?: (column: KanbanColumn<T>) => ReactNode;
  onMove: (move: KanbanMove) => void;
  /** Accessible name of a card's grip, e.g. `(item) => "Move " + item.title`. */
  gripLabel: (item: T) => string;
  /** Spoken after a move: column title as text, 1-based position and column size. */
  announceMove: (
    item: T,
    column: KanbanColumn<T>,
    position: number,
    total: number,
  ) => string;
}

interface Drag {
  id: string;
  from: string;
  index: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  w: number;
  h: number;
  over?: { column: string; index: number } | undefined;
}

const THRESHOLD = 5;

/**
 * Cards move by pointer (drag the card; touch uses the grip) or keyboard (focus the grip:
 * ArrowUp/ArrowDown inside a column, ArrowLeft/ArrowRight to the next column).
 */
export function KanbanBoard<T extends KanbanItem>({
  label,
  columns,
  renderCard,
  renderFooter,
  emptyLabel,
  onMove,
  gripLabel,
  announceMove,
  className,
  ...rest
}: KanbanBoardProps<T>) {
  const prefix = useId();
  const root = useRef<HTMLDivElement>(null);
  const grips = useRef(new Map<string, HTMLButtonElement>());
  const refocus = useRef<string | undefined>(undefined);
  const [drag, setDrag] = useState<Drag>();
  const [message, setMessage] = useState("");
  const live = useRef({ drag, columns, onMove, announceMove });
  live.current = { drag, columns, onMove, announceMove };
  const pending = useRef<Drag | undefined>(undefined);

  useEffect(() => {
    if (refocus.current) grips.current.get(refocus.current)?.focus();
    refocus.current = undefined;
  });

  function locate(x: number, y: number, id: string): Drag["over"] {
    const found = [
      ...(root.current?.querySelectorAll<HTMLElement>("[data-column]") ?? []),
    ].find((column) => {
      const r = column.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    });
    if (!found) return undefined;
    const cards = [
      ...found.querySelectorAll<HTMLElement>("[data-card]"),
    ].filter((card) => card.dataset["card"] !== id);
    const at = cards.findIndex((card) => {
      const r = card.getBoundingClientRect();
      return y < r.top + r.height / 2;
    });
    return {
      column: found.dataset["column"] ?? "",
      index: at < 0 ? cards.length : at,
    };
  }

  function announce(
    id: string,
    columnId: string,
    index: number,
    total: number,
  ) {
    const { columns: all, announceMove: say } = live.current;
    const column = all.find((c) => c.id === columnId);
    const item = all.flatMap((c) => c.items).find((i) => i.id === id);
    if (column && item) setMessage(say(item, column, index + 1, total));
  }

  useEffect(() => {
    function move(event: globalThis.PointerEvent) {
      const current = live.current.drag;
      const start = pending.current;
      if (!current && start) {
        if (
          Math.hypot(event.clientX - start.x, event.clientY - start.y) <
          THRESHOLD
        )
          return;
        setDrag({
          ...start,
          x: event.clientX,
          y: event.clientY,
          over: locate(event.clientX, event.clientY, start.id),
        });
      } else if (current) {
        setDrag({
          ...current,
          x: event.clientX,
          y: event.clientY,
          over: locate(event.clientX, event.clientY, current.id),
        });
      }
    }
    function end() {
      const current = live.current.drag;
      pending.current = undefined;
      setDrag(undefined);
      if (!current?.over) return;
      const { column, index } = current.over;
      if (column === current.from && index === current.index) return;
      live.current.onMove({
        id: current.id,
        fromColumn: current.from,
        toColumn: column,
        index,
      });
      const target = live.current.columns.find((c) => c.id === column);
      const size =
        (target?.items.length ?? 0) + (column === current.from ? 0 : 1);
      announce(current.id, column, index, size);
    }
    function cancel() {
      pending.current = undefined;
      setDrag(undefined);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", cancel);
    };
  }, []);

  function onPointerDown(
    event: PointerEvent<HTMLElement>,
    id: string,
    from: string,
    index: number,
  ) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as Element;
    const onGrip = target.closest(".m-kanban__grip") !== null;
    if (event.pointerType === "touch" && !onGrip) return;
    if (!onGrip && target.closest("a, button, input, select, textarea")) return;
    // Keeps the browser from selecting text while the card is dragged.
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    pending.current = {
      id,
      from,
      index,
      x: event.clientX,
      y: event.clientY,
      dx: event.clientX - rect.left,
      dy: event.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    };
  }

  function onKeyDown(
    event: KeyboardEvent,
    id: string,
    columnIndex: number,
    index: number,
  ) {
    const dc =
      event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
    const di = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    if (dc === 0 && di === 0) return;
    event.preventDefault();
    const target = columns[columnIndex + dc];
    if (!target) return;
    const to = dc === 0 ? index + di : Math.min(index, target.items.length);
    const source = columns[columnIndex];
    if (
      !source ||
      to < 0 ||
      to > (dc === 0 ? source.items.length - 1 : target.items.length)
    )
      return;
    refocus.current = id;
    onMove({ id, fromColumn: source.id, toColumn: target.id, index: to });
    announce(id, target.id, to, target.items.length + (dc === 0 ? 0 : 1));
  }

  const dragged = drag
    ? columns
        .flatMap((c) => c.items.map((item) => ({ item, column: c })))
        .find((entry) => entry.item.id === drag.id)
    : undefined;

  return (
    <>
      <div
        {...rest}
        ref={root}
        className={cx("m-kanban", className)}
        role="group"
        aria-label={label}
        data-dragging={drag ? "" : undefined}
      >
        {columns.map((column, columnIndex) => {
          const headingId = `${prefix}-${column.id}`;
          const nodes: ReactNode[] = [];
          let seen = 0;
          let placed = false;
          const placeholder = (
            <li
              key="placeholder"
              className="m-kanban__placeholder"
              aria-hidden="true"
              style={
                {
                  "--m-placeholder-h": `${String(drag?.h ?? 0)}px`,
                } as CSSProperties
              }
            />
          );
          for (const [index, item] of column.items.entries()) {
            const isDragged = drag?.id === item.id;
            if (
              !isDragged &&
              drag?.over?.column === column.id &&
              drag.over.index === seen &&
              !placed
            ) {
              nodes.push(placeholder);
              placed = true;
            }
            if (!isDragged) seen += 1;
            nodes.push(
              <li
                key={item.id}
                className="m-kanban__card"
                data-card={item.id}
                data-dragging={isDragged ? "" : undefined}
                onPointerDown={(event) => {
                  onPointerDown(event, item.id, column.id, index);
                }}
              >
                <button
                  type="button"
                  className="m-kanban__grip"
                  aria-label={gripLabel(item)}
                  ref={(element) => {
                    if (element) grips.current.set(item.id, element);
                    else grips.current.delete(item.id);
                  }}
                  onKeyDown={(event) => {
                    onKeyDown(event, item.id, columnIndex, index);
                  }}
                >
                  <Icon icon={dragIcon} size={16} />
                </button>
                <div className="m-kanban__content">
                  {renderCard(item, column)}
                </div>
              </li>,
            );
          }
          if (!placed && drag?.over?.column === column.id)
            nodes.push(placeholder);
          if (nodes.length === 0 && emptyLabel)
            nodes.push(
              <li key="empty" className="m-kanban__empty">
                {emptyLabel}
              </li>,
            );
          return (
            <section
              key={column.id}
              className="m-kanban__column"
              aria-labelledby={headingId}
              data-column={column.id}
              data-tone={column.tone}
              data-over={drag?.over?.column === column.id ? "" : undefined}
            >
              <h3 id={headingId} className="m-kanban__header">
                <span>{column.title}</span>
                <span className="m-badge" data-tone="neutral">
                  {column.items.length}
                </span>
              </h3>
              <ul className="m-kanban__list" role="list">
                {nodes}
              </ul>
              {renderFooter?.(column)}
            </section>
          );
        })}
      </div>
      {drag && dragged ? (
        <div
          className="m-kanban__card m-kanban__ghost"
          aria-hidden="true"
          style={
            {
              "--m-ghost-x": `${String(drag.x - drag.dx)}px`,
              "--m-ghost-y": `${String(drag.y - drag.dy)}px`,
              "--m-ghost-w": `${String(drag.w)}px`,
            } as CSSProperties
          }
        >
          <div className="m-kanban__content">
            {renderCard(dragged.item, dragged.column)}
          </div>
        </div>
      ) : null}
      <div className="m-sr-only" role="status" aria-live="polite">
        {message}
      </div>
    </>
  );
}
