<script lang="ts">
  import type { IconDefinition } from "@interstellarforge/matter-icons";
  import type { HTMLInputAttributes } from "svelte/elements";

  import Icon from "./Icon.svelte";

  interface Props extends Omit<HTMLInputAttributes, "value"> {
    value?: string;
    /** Sets `aria-invalid` and the error border. */
    invalid?: boolean | undefined;
    /** Decorative leading icon, e.g. `search`. The input still needs its own accessible name. */
    icon?: IconDefinition;
  }

  let {
    invalid = false,
    icon,
    value = $bindable(),
    class: className,
    ...rest
  }: Props = $props();
</script>

{#snippet field(cls: unknown)}
  <input
    {...rest}
    bind:value
    class={["m-input", cls]}
    aria-invalid={invalid ? true : undefined}
  />
{/snippet}

{#if icon}
  <span class={["m-input-icon", className]}>
    <Icon {icon} />
    {@render field(undefined)}
  </span>
{:else}
  {@render field(className)}
{/if}
