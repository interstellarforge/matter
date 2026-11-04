<script lang="ts">
  import type { Snippet } from "svelte";

  import type { SidebarGroup, SidebarItem } from "./types.ts";

  interface Props {
    /** Accessible name of the nav landmark. */
    label: string;
    groups: SidebarGroup[];
    /** Icon-only rail: labels stay in the DOM but are visually hidden. */
    collapsed?: boolean;
    /** Optional decorative icon per item. */
    icon?: Snippet<[SidebarItem]>;
  }

  let { label, groups, collapsed = false, icon }: Props = $props();

  const base = $props.id();
  // Open state per collapsible group; unset means the group's `defaultOpen` (default true).
  let openState: Record<string, boolean> = $state({});
  const isOpen = (group: SidebarGroup) => openState[group.id] ?? group.defaultOpen ?? true;
</script>

<nav class="m-sidebar" aria-label={label} data-collapsed={collapsed ? "" : undefined}>
  {#each groups as group (group.id)}
    <div class="m-sidebar__group">
      {#if group.label}
        {#if group.collapsible}
          <button
            type="button"
            class="m-sidebar__heading"
            aria-expanded={isOpen(group)}
            aria-controls={`${base}-${group.id}`}
            onclick={() => (openState[group.id] = !isOpen(group))}
          >
            {group.label}
            <span aria-hidden="true">{isOpen(group) ? "−" : "+"}</span>
          </button>
        {:else}
          <div class="m-sidebar__heading">{group.label}</div>
        {/if}
      {/if}
      <ul id={`${base}-${group.id}`} hidden={group.collapsible && !isOpen(group)}>
        {#each group.items as item (item.id)}
          <li>
            <a class="m-sidebar__link" href={item.href} aria-current={item.current ? "page" : undefined}>
              {@render icon?.(item)}
              <span class="m-sidebar__text">{item.label}</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</nav>
