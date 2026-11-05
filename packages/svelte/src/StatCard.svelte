<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    label: string;
    value: string;
    /** Decorative icon, e.g. `<Icon icon={search} />`. */
    icon?: Snippet;
    /** Next to the value: a trend or a `Badge`. */
    aside?: Snippet;
    /** Supporting text under the value. */
    description?: string;
  }

  let { label, value, icon, aside, description, class: className, ...rest }: Props = $props();
</script>

<div {...rest} class={["m-card", "m-stat", className]}>
  <div class="m-stat__head">
    <p class="m-stat__label">{label}</p>
    {#if icon}<span class="m-stat__icon" aria-hidden="true">{@render icon()}</span>{/if}
  </div>
  <div class="m-stat__body">
    <p class="m-stat__value">{value}</p>
    {#if aside}{@render aside()}{/if}
  </div>
  {#if description}<p class="m-stat__text">{description}</p>{/if}
</div>
