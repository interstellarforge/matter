"use client";

import { drag as dragIcon } from "@interstellarforge/matter-icons";
import type {
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
} from "react";
import { useEffect, useRef, useState } from "react";

import { cx } from "./cx.ts";
import { Icon } from "./Icon.tsx";

export interface SortableItem {
  id: string;
}

export interface SortableMove {
  id: string;
  /** Index before and after the move. */
  from: number;
  to: number;
  /** All ids in the new order. */
  ids: string[];
}

export interface SortableListProps<T extends SortableItem> extends Omit<
  ComponentProps<"ul">,
  "children"
> {
  /** Accessible name of the list (required). */
  label: string;
  /** The app owns the order: sort `items` by the ids from `onReorder`. */
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onReorder: (move: SortableMove) => void;
  /** Accessible name of the grip, e.g. `(item) => "Move " + item.title`. */
  gripLabel: (item: T) => string;
  /** Spoken after a move, e.g. `(item, n, total) => item.title + ", " + n + " of " + total`. */
  announceMove: (item: T, position: number, total: number) => string;
}

interface Drag {
  id: string;
  index: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  w: number;
  h: number;
  /** Drop position among the other items. */
  over: number;
}

const THRESHOLD = 5;

function moved(ids: string[], from: number, to: number) {
  const next = [...ids];
  const [id] = next.splice(from, 1);
  if (id !== undefined) next.splice(to, 0, id);
  return next;
}

/**
 * Reorder by pointer (drag the item; touch uses the grip) or keyboard (ArrowUp/ArrowDown/Home/End
 * on the grip). While dragging, a floating copy follows the pointer and a placeholder marks the drop.
 */
export function SortableList<T extends SortableItem>({
  label,
  items,
  renderItem,
  onReorder,
  gripLabel,
  announceMove,
  className,
  ...rest
}: SortableListProps<T>) {
  const [drag, setDrag] = useState<Drag>();
  const [message, setMessage] = useState("");
  const list = useRef<HTMLUListElement>(null);
  const grips = useRef(new Map<string, HTMLButtonElement>());
  const refocus = useRef<string | undefined>(undefined);
  const pending = useRef<Drag | undefined>(undefined);
  const live = useRef({ drag, items, onReorder, announceMove });
  live.current = { drag, items, onReorder, announceMove };

  useEffect(() => {
    if (refocus.current) grips.current.get(refocus.current)?.focus();
    refocus.current = undefined;
  });

  function announce(id: string, position: number) {
    const { items: all, announceMove: say } = live.current;
    const item = all.find((entry) => entry.id === id);
    if (item) setMessage(say(item, position, all.length));
  }

  useEffect(() => {
    function locate(y: number, id: string) {
      const rows = [
        ...(list.current?.querySelectorAll<HTMLElement>("[data-item]") ?? []),
      ].filter((row) => row.dataset["item"] !== id);
      const at = rows.findIndex((row) => {
        const r = row.getBoundingClientRect();
        return y < r.top + r.height / 2;
      });
      return at < 0 ? rows.length : at;
    }
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
          over: locate(event.clientY, start.id),
        });
      } else if (current) {
        setDrag({
          ...current,
          x: event.clientX,
          y: event.clientY,
          over: locate(event.clientY, current.id),
        });
      }
    }
    function end() {
      const current = live.current.drag;
      pending.current = undefined;
      setDrag(undefined);
      if (!current) return;
      const ids = live.current.items
        .map((item) => item.id)
        .filter((id) => id !== current.id);
      ids.splice(current.over, 0, current.id);
      if (current.over === current.index) return;
      live.current.onReorder({
        id: current.id,
        from: current.index,
        to: current.over,
        ids,
      });
      announce(current.id, current.over + 1);
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
    index: number,
  ) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as Element;
    const onGrip = target.closest(".m-sortable__grip") !== null;
    if (event.pointerType === "touch" && !onGrip) return;
    if (!onGrip && target.closest("a, button, input, select, textarea")) return;
    // Keeps the browser from selecting text while the item is dragged.
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    pending.current = {
      id,
      index,
      x: event.clientX,
      y: event.clientY,
      dx: event.clientX - rect.left,
      dy: event.clientY - rect.top,
      w: rect.width,
      h: rect.height,
      over: index,
    };
  }

  function onKeyDown(event: KeyboardEvent, id: string, index: number) {
    const last = items.length - 1;
    const to =
      event.key === "ArrowUp"
        ? index - 1
        : event.key === "ArrowDown"
          ? index + 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : undefined;
    if (to === undefined) return;
    event.preventDefault();
    if (to < 0 || to > last || to === index) return;
    refocus.current = id;
    onReorder({
      id,
      from: index,
      to,
      ids: moved(
        items.map((item) => item.id),
        index,
        to,
      ),
    });
    announce(id, to + 1);
  }

  const dragged = drag ? items.find((item) => item.id === drag.id) : undefined;
  const nodes: ReactNode[] = [];
  let seen = 0;
  let placed = false;
  const placeholder = (
    <li
      key="placeholder"
      className="m-sortable__placeholder"
      aria-hidden="true"
      style={
        { "--m-placeholder-h": `${String(drag?.h ?? 0)}px` } as CSSProperties
      }
    />
  );
  for (const [index, item] of items.entries()) {
    const isDragged = drag?.id === item.id;
    if (drag && !isDragged && drag.over === seen && !placed) {
      nodes.push(placeholder);
      placed = true;
    }
    if (!isDragged) seen += 1;
    nodes.push(
      <li
        key={item.id}
        className="m-sortable__item"
        data-item={item.id}
        data-dragging={isDragged ? "" : undefined}
        onPointerDown={(event) => {
          onPointerDown(event, item.id, index);
        }}
      >
        <button
          type="button"
          className="m-sortable__grip"
          aria-label={gripLabel(item)}
          ref={(element) => {
            if (element) grips.current.set(item.id, element);
            else grips.current.delete(item.id);
          }}
          onKeyDown={(event) => {
            onKeyDown(event, item.id, index);
          }}
        >
          <Icon icon={dragIcon} size={16} />
        </button>
        <div className="m-sortable__content">{renderItem(item, index)}</div>
      </li>,
    );
  }
  if (drag && !placed) nodes.push(placeholder);

  return (
    <>
      <ul
        {...rest}
        ref={list}
        className={cx("m-sortable", className)}
        aria-label={label}
        data-sorting={drag ? "" : undefined}
      >
        {nodes}
      </ul>
      {drag && dragged ? (
        <div
          className="m-sortable__item m-sortable__ghost"
          aria-hidden="true"
          style={
            {
              "--m-ghost-x": `${String(drag.x - drag.dx)}px`,
              "--m-ghost-y": `${String(drag.y - drag.dy)}px`,
              "--m-ghost-w": `${String(drag.w)}px`,
            } as CSSProperties
          }
        >
          <span className="m-sortable__grip">
            <Icon icon={dragIcon} size={16} />
          </span>
          <div className="m-sortable__content">
            {renderItem(dragged, drag.index)}
          </div>
        </div>
      ) : null}
      <div className="m-sr-only" role="status" aria-live="polite">
        {message}
      </div>
    </>
  );
}
