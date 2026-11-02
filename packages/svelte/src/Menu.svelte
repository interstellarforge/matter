<script lang="ts">
  import { tick } from "svelte";

  import type { MenuItem } from "./types.ts";

  interface Props {
    /** Visible text of the trigger button. */
    triggerLabel: string;
    items: MenuItem[];
    onSelect: (id: string) => void;
  }

  let { triggerLabel, items, onSelect }: Props = $props();

  const menuId = $props.id();
  let root: HTMLDivElement | undefined = $state();
  let trigger: HTMLButtonElement | undefined = $state();
  const itemEls: (HTMLButtonElement | undefined)[] = [];
  let open = $state(false);
  const enabled = $derived(items.flatMap((item, index) => (item.disabled ? [] : [index])));

  $effect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: PointerEvent) {
      if (!root?.contains(event.target as Node)) {
        open = false;
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  });

  function focusItem(index: number | undefined) {
    if (index !== undefined) {
      itemEls[index]?.focus();
    }
  }

  function close() {
    open = false;
    trigger?.focus();
  }

  async function openAt(position: "first" | "last") {
    open = true;
    await tick();
    focusItem(position === "first" ? enabled[0] : enabled.at(-1));
  }

  function onMenuKeyDown(event: KeyboardEvent) {
    const current = itemEls.findIndex((element) => element === document.activeElement);
    const position = enabled.indexOf(current);
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    const next = {
      ArrowDown: enabled[(position + 1) % enabled.length],
      ArrowUp: enabled[(position - 1 + enabled.length) % enabled.length],
      Home: enabled[0],
      End: enabled.at(-1),
    }[event.key];
    if (next !== undefined) {
      event.preventDefault();
      focusItem(next);
      return;
    }
    if (event.key.length === 1) {
      const typed = event.key.toLowerCase();
      focusItem(
        enabled.find(
          (index) => index > current && items[index]?.label.toLowerCase().startsWith(typed),
        ) ?? enabled.find((index) => items[index]?.label.toLowerCase().startsWith(typed)),
      );
    }
  }
</script>

<div bind:this={root} class="m-menu-wrap">
  <button
    bind:this={trigger}
    type="button"
    class="m-button"
    aria-haspopup="menu"
    aria-expanded={open}
    aria-controls={menuId}
    onclick={() => {
      if (open) {
        open = false;
      } else {
        void openAt("first");
      }
    }}
    onkeydown={(event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        void openAt(event.key === "ArrowDown" ? "first" : "last");
      }
    }}
  >
    {triggerLabel}
  </button>
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div id={menuId} role="menu" class="m-menu" hidden={!open} onkeydown={onMenuKeyDown}>
    {#each items as item, index (item.id)}
      <button
        bind:this={itemEls[index]}
        type="button"
        role="menuitem"
        class="m-menu__item"
        tabindex={-1}
        disabled={item.disabled}
        onclick={() => {
          onSelect(item.id);
          close();
        }}
      >
        {item.label}
      </button>
    {/each}
  </div>
</div>
