<script lang="ts" generics="T extends { id: string }">
  import { drag as dragIcon } from "@interstellarforge/matter-icons";
  import { type Snippet, tick } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import Icon from "./Icon.svelte";
  import type { KanbanColumn, KanbanMove } from "./types.ts";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /** Accessible name of the board (required). */
    label: string;
    /** The app owns the data: apply `onMove` to `columns`. */
    columns: KanbanColumn<T>[];
    /** Renders one card's content. */
    card: Snippet<[T, KanbanColumn<T>]>;
    /** Shown in a column without cards. */
    emptyLabel?: string;
    /** Below a column's cards, e.g. an "add" button. */
    footer?: Snippet<[KanbanColumn<T>]>;
    onMove: (move: KanbanMove) => void;
    /** Accessible name of a card's grip, e.g. `(item) => "Move " + item.title`. */
    gripLabel: (item: T) => string;
    /** Spoken after a move: 1-based position and column size. */
    announceMove: (item: T, column: KanbanColumn<T>, position: number, total: number) => string;
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

  let {
    label,
    columns,
    card,
    footer,
    emptyLabel,
    onMove,
    gripLabel,
    announceMove,
    class: className,
    ...rest
  }: Props = $props();

  const THRESHOLD = 5;
  const prefix = $props.id();
  let root: HTMLDivElement | undefined;
  let drag = $state<Drag>();
  let message = $state("");
  let pending: Drag | undefined;

  const dragged = $derived(
    drag
      ? columns
          .flatMap((column) => column.items.map((entry) => ({ entry, column })))
          .find((found) => found.entry.id === drag?.id)
      : undefined,
  );

  function locate(x: number, y: number, id: string): Drag["over"] {
    const found = [...(root?.querySelectorAll<HTMLElement>("[data-column]") ?? [])].find((column) => {
      const r = column.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    });
    if (!found) return undefined;
    const cards = [...found.querySelectorAll<HTMLElement>("[data-card]")].filter(
      (el) => el.dataset["card"] !== id,
    );
    const at = cards.findIndex((el) => {
      const r = el.getBoundingClientRect();
      return y < r.top + r.height / 2;
    });
    return { column: found.dataset["column"] ?? "", index: at < 0 ? cards.length : at };
  }

  function announce(id: string, columnId: string, index: number, total: number) {
    const column = columns.find((c) => c.id === columnId);
    const entry = columns.flatMap((c) => c.items).find((i) => i.id === id);
    if (column && entry) message = announceMove(entry, column, index + 1, total);
  }

  function onWindowMove(event: PointerEvent) {
    if (!drag && pending) {
      if (Math.hypot(event.clientX - pending.x, event.clientY - pending.y) < THRESHOLD) return;
      drag = { ...pending, over: locate(event.clientX, event.clientY, pending.id) };
    } else if (drag) {
      drag = {
        ...drag,
        x: event.clientX,
        y: event.clientY,
        over: locate(event.clientX, event.clientY, drag.id),
      };
    }
  }

  function onWindowUp() {
    const current = drag;
    pending = undefined;
    drag = undefined;
    if (!current?.over) return;
    const { column, index } = current.over;
    if (column === current.from && index === current.index) return;
    // Read the size first: the app may update `columns` synchronously inside `onMove`.
    const size = (columns.find((c) => c.id === column)?.items.length ?? 0) + (column === current.from ? 0 : 1);
    onMove({ id: current.id, fromColumn: current.from, toColumn: column, index });
    announce(current.id, column, index, size);
  }

  function onWindowCancel() {
    pending = undefined;
    drag = undefined;
  }

  function onPointerDown(event: PointerEvent, id: string, from: string, index: number) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as Element;
    const onGrip = target.closest(".m-kanban__grip") !== null;
    if (event.pointerType === "touch" && !onGrip) return;
    if (!onGrip && target.closest("a, button, input, select, textarea")) return;
    // Keeps the browser from selecting text while the card is dragged.
    event.preventDefault();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    pending = {
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

  async function onKeyDown(event: KeyboardEvent, id: string, columnIndex: number, index: number) {
    const dc = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
    const di = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    if (dc === 0 && di === 0) return;
    event.preventDefault();
    const target = columns[columnIndex + dc];
    const source = columns[columnIndex];
    if (!target || !source) return;
    const to = dc === 0 ? index + di : Math.min(index, target.items.length);
    if (to < 0 || to > (dc === 0 ? source.items.length - 1 : target.items.length)) return;
    onMove({ id, fromColumn: source.id, toColumn: target.id, index: to });
    announce(id, target.id, to, target.items.length + (dc === 0 ? 0 : 1));
    await tick();
    root
      ?.querySelector<HTMLElement>(`[data-card="${CSS.escape(id)}"] .m-kanban__grip`)
      ?.focus();
  }

  interface Entry {
    key: string;
    item?: T;
    index: number;
  }

  /** The column's cards with the drop placeholder inserted where the pointer is. */
  function entries(column: KanbanColumn<T>): Entry[] {
    const result: Entry[] = [];
    let seen = 0;
    let placed = false;
    const over = drag?.over;
    for (const [index, item] of column.items.entries()) {
      const isDragged = drag?.id === item.id;
      if (!isDragged && over?.column === column.id && over.index === seen && !placed) {
        result.push({ key: "placeholder", index: -1 });
        placed = true;
      }
      if (!isDragged) seen += 1;
      result.push({ key: item.id, item, index });
    }
    if (!placed && over?.column === column.id) result.push({ key: "placeholder", index: -1 });
    return result;
  }
</script>

<svelte:window onpointermove={onWindowMove} onpointerup={onWindowUp} onpointercancel={onWindowCancel} />

<div
  {...rest}
  bind:this={root}
  class={["m-kanban", className]}
  role="group"
  aria-label={label}
  data-dragging={drag ? "" : undefined}
>
  {#each columns as column, columnIndex (column.id)}
    <section
      class="m-kanban__column"
      aria-labelledby={`${prefix}-${column.id}`}
      data-column={column.id}
      data-tone={column.tone}
      data-over={drag?.over?.column === column.id ? "" : undefined}
    >
      <h3 id={`${prefix}-${column.id}`} class="m-kanban__header">
        <span>{column.title}</span>
        <span class="m-badge" data-tone="neutral">{column.items.length}</span>
      </h3>
      <ul class="m-kanban__list" role="list">
        {#each entries(column) as entry (entry.key)}
          {#if entry.item}
            {@const item = entry.item}
            <li
              class="m-kanban__card"
              data-card={item.id}
              data-dragging={drag?.id === item.id ? "" : undefined}
              onpointerdown={(event) => {
                onPointerDown(event, item.id, column.id, entry.index);
              }}
            >
              <button
                type="button"
                class="m-kanban__grip"
                aria-label={gripLabel(item)}
                onkeydown={(event) => onKeyDown(event, item.id, columnIndex, entry.index)}
              >
                <Icon icon={dragIcon} size={16} />
              </button>
              <div class="m-kanban__content">{@render card(item, column)}</div>
            </li>
          {:else}
            <li class="m-kanban__placeholder" aria-hidden="true" style={`--m-placeholder-h:${String(drag?.h ?? 0)}px`}></li>
          {/if}
        {/each}
        {#if column.items.length === 0 && drag?.over?.column !== column.id && emptyLabel}
          <li class="m-kanban__empty">{emptyLabel}</li>
        {/if}
      </ul>
      {#if footer}{@render footer(column)}{/if}
    </section>
  {/each}
</div>
{#if drag && dragged}
  <div
    class="m-kanban__card m-kanban__ghost"
    aria-hidden="true"
    style={`--m-ghost-x:${String(drag.x - drag.dx)}px;--m-ghost-y:${String(drag.y - drag.dy)}px;--m-ghost-w:${String(drag.w)}px`}
  >
    <div class="m-kanban__content">{@render card(dragged.entry, dragged.column)}</div>
  </div>
{/if}
<div class="m-sr-only" role="status" aria-live="polite">{message}</div>
