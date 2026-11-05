<script lang="ts" generics="T extends { id: string }">
  import { drag as dragIcon } from "@interstellarforge/matter-icons";
  import { type Snippet, tick } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import Icon from "./Icon.svelte";
  import type { SortableMove } from "./types.ts";

  interface Props extends Omit<HTMLAttributes<HTMLUListElement>, "children"> {
    /** Accessible name of the list (required). */
    label: string;
    /** The app owns the order: sort `items` by the ids from `onReorder`. */
    items: T[];
    /** Renders one item's content. */
    item: Snippet<[T, number]>;
    onReorder: (move: SortableMove) => void;
    /** Accessible name of the grip, e.g. `(item) => "Move " + item.title`. */
    gripLabel: (item: T) => string;
    /** Spoken after a move: 1-based position and list size. */
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

  let {
    label,
    items,
    item,
    onReorder,
    gripLabel,
    announceMove,
    class: className,
    ...rest
  }: Props = $props();

  const THRESHOLD = 5;
  let drag = $state<Drag>();
  let message = $state("");
  let pending: Drag | undefined;
  let list: HTMLUListElement | undefined;

  const dragged = $derived(drag ? items.find((entry) => entry.id === drag?.id) : undefined);

  function moved(ids: string[], from: number, to: number) {
    const next = [...ids];
    const [id] = next.splice(from, 1);
    if (id !== undefined) next.splice(to, 0, id);
    return next;
  }

  function announce(id: string, position: number) {
    const entry = items.find((candidate) => candidate.id === id);
    if (entry) message = announceMove(entry, position, items.length);
  }

  function locate(y: number, id: string) {
    const rows = [...(list?.querySelectorAll<HTMLElement>("[data-item]") ?? [])].filter(
      (row) => row.dataset["item"] !== id,
    );
    const at = rows.findIndex((row) => {
      const r = row.getBoundingClientRect();
      return y < r.top + r.height / 2;
    });
    return at < 0 ? rows.length : at;
  }

  function onWindowMove(event: PointerEvent) {
    if (!drag && pending) {
      if (Math.hypot(event.clientX - pending.x, event.clientY - pending.y) < THRESHOLD) return;
      drag = { ...pending, over: locate(event.clientY, pending.id) };
    } else if (drag) {
      drag = { ...drag, x: event.clientX, y: event.clientY, over: locate(event.clientY, drag.id) };
    }
  }

  function onWindowUp() {
    const current = drag;
    pending = undefined;
    drag = undefined;
    if (!current || current.over === current.index) return;
    const ids = items.map((entry) => entry.id).filter((id) => id !== current.id);
    ids.splice(current.over, 0, current.id);
    // Read what is needed first: the app may update `items` synchronously inside `onReorder`.
    const position = current.over + 1;
    onReorder({ id: current.id, from: current.index, to: current.over, ids });
    announce(current.id, position);
  }

  function onWindowCancel() {
    pending = undefined;
    drag = undefined;
  }

  function onPointerDown(event: PointerEvent, id: string, index: number) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as Element;
    const onGrip = target.closest(".m-sortable__grip") !== null;
    if (event.pointerType === "touch" && !onGrip) return;
    if (!onGrip && target.closest("a, button, input, select, textarea")) return;
    // Keeps the browser from selecting text while the item is dragged.
    event.preventDefault();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    pending = {
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

  async function onKeyDown(event: KeyboardEvent, id: string, index: number) {
    const last = items.length - 1;
    const to =
      event.key === "ArrowUp" ? index - 1
      : event.key === "ArrowDown" ? index + 1
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : undefined;
    if (to === undefined) return;
    event.preventDefault();
    if (to < 0 || to > last || to === index) return;
    onReorder({
      id,
      from: index,
      to,
      ids: moved(
        items.map((entry) => entry.id),
        index,
        to,
      ),
    });
    announce(id, to + 1);
    await tick();
    const row = ([...(list?.children ?? [])] as HTMLElement[]).find((li) => li.dataset["item"] === id);
    row?.querySelector("button")?.focus();
  }

  interface Entry {
    key: string;
    item?: T;
    index: number;
  }

  /** The items with the drop placeholder inserted where the pointer is. */
  function entries(): Entry[] {
    const result: Entry[] = [];
    let seen = 0;
    let placed = false;
    for (const [index, entry] of items.entries()) {
      const isDragged = drag?.id === entry.id;
      if (drag && !isDragged && drag.over === seen && !placed) {
        result.push({ key: "placeholder", index: -1 });
        placed = true;
      }
      if (!isDragged) seen += 1;
      result.push({ key: entry.id, item: entry, index });
    }
    if (drag && !placed) result.push({ key: "placeholder", index: -1 });
    return result;
  }
</script>

<svelte:window onpointermove={onWindowMove} onpointerup={onWindowUp} onpointercancel={onWindowCancel} />

<ul
  {...rest}
  bind:this={list}
  class={["m-sortable", className]}
  aria-label={label}
  data-sorting={drag ? "" : undefined}
>
  {#each entries() as entry (entry.key)}
    {#if entry.item}
      {@const current = entry.item}
      <li
        class="m-sortable__item"
        data-item={current.id}
        data-dragging={drag?.id === current.id ? "" : undefined}
        onpointerdown={(event) => {
          onPointerDown(event, current.id, entry.index);
        }}
      >
        <button
          type="button"
          class="m-sortable__grip"
          aria-label={gripLabel(current)}
          onkeydown={(event) => onKeyDown(event, current.id, entry.index)}
        >
          <Icon icon={dragIcon} size={16} />
        </button>
        <div class="m-sortable__content">{@render item(current, entry.index)}</div>
      </li>
    {:else}
      <li class="m-sortable__placeholder" aria-hidden="true" style={`--m-placeholder-h:${String(drag?.h ?? 0)}px`}></li>
    {/if}
  {/each}
</ul>
{#if drag && dragged}
  <div
    class="m-sortable__item m-sortable__ghost"
    aria-hidden="true"
    style={`--m-ghost-x:${String(drag.x - drag.dx)}px;--m-ghost-y:${String(drag.y - drag.dy)}px;--m-ghost-w:${String(drag.w)}px`}
  >
    <span class="m-sortable__grip"><Icon icon={dragIcon} size={16} /></span>
    <div class="m-sortable__content">{@render item(dragged, drag.index)}</div>
  </div>
{/if}
<div class="m-sr-only" role="status" aria-live="polite">{message}</div>
