<script lang="ts">
  import type { Snippet } from "svelte";

  import type { TabItem } from "./types.ts";

  interface Props {
    items: TabItem[];
    /** Accessible name of the tab list. */
    label: string;
    value?: string;
    onValueChange?: (value: string) => void;
    /** Renders the panel content for the selected tab. */
    panel: Snippet<[string]>;
  }

  let { items, label, value = $bindable(), onValueChange, panel }: Props = $props();

  const base = $props.id();
  const tabs: Record<string, HTMLButtonElement | undefined> = {};
  const enabled = $derived(items.filter((item) => !item.disabled));
  const selected = $derived(value ?? enabled[0]?.id);

  function select(id: string) {
    value = id;
    onValueChange?.(id);
    tabs[id]?.focus();
  }

  function onkeydown(event: KeyboardEvent) {
    const index = enabled.findIndex((item) => item.id === selected);
    const last = enabled.length - 1;
    const target = {
      ArrowRight: enabled[index === last ? 0 : index + 1],
      ArrowLeft: enabled[index <= 0 ? last : index - 1],
      Home: enabled[0],
      End: enabled[last],
    }[event.key];
    if (target) {
      event.preventDefault();
      select(target.id);
    }
  }
</script>

<div class="m-tabs">
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div role="tablist" aria-label={label} class="m-tablist" {onkeydown}>
    {#each items as item (item.id)}
      <button
        bind:this={tabs[item.id]}
        type="button"
        role="tab"
        id="{base}-tab-{item.id}"
        class="m-tab"
        aria-selected={item.id === selected}
        aria-controls="{base}-panel-{item.id}"
        tabindex={item.id === selected ? 0 : -1}
        disabled={item.disabled}
        onclick={() => {
          select(item.id);
        }}
      >
        {item.label}
      </button>
    {/each}
  </div>
  {#each items as item (item.id)}
    <div
      role="tabpanel"
      id="{base}-panel-{item.id}"
      class="m-tabpanel"
      aria-labelledby="{base}-tab-{item.id}"
      hidden={item.id !== selected}
    >
      {#if item.id === selected}{@render panel(item.id)}{/if}
    </div>
  {/each}
</div>
