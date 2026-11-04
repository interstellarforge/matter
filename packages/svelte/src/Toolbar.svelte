<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Accessible name of the toolbar (required). */
    label: string;
    children?: Snippet;
  }

  const ITEMS = "button:not(:disabled), [role=menuitem]:not(:disabled)";

  /** Toolbar with one tab stop; `←→`, `Home` and `End` move between its buttons. */
  let { label, class: className, children, onkeydown, ...rest }: Props = $props();
  let el: HTMLDivElement | undefined = $state();

  // Roving tabindex, re-applied after every update because consumers add and remove buttons.
  $effect(() => {
    const items = [...(el?.querySelectorAll<HTMLElement>(ITEMS) ?? [])];
    const active = items.find((item) => item.tabIndex === 0) ?? items[0];
    for (const item of items) item.tabIndex = item === active ? 0 : -1;
  });

  function handleKeydown(event: KeyboardEvent & { currentTarget: HTMLDivElement }) {
    onkeydown?.(event);
    if (event.defaultPrevented) return;
    const items = [...event.currentTarget.querySelectorAll<HTMLElement>(ITEMS)];
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    const next = {
      ArrowRight: (index + 1) % items.length,
      ArrowLeft: (index - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    }[event.key];
    const target = next === undefined ? undefined : items[next];
    if (!target) return;
    event.preventDefault();
    for (const item of items) item.tabIndex = -1;
    target.tabIndex = 0;
    target.focus();
  }
</script>

<div
  {...rest}
  bind:this={el}
  role="toolbar"
  aria-label={label}
  class={["m-toolbar", className]}
  onkeydown={handleKeydown}
>
  {@render children?.()}
</div>
