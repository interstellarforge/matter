<script lang="ts">
  import type { IconDefinition } from "@interstellarforge/matter-icons";
  import type { SVGAttributes } from "svelte/elements";

  interface Props extends SVGAttributes<SVGSVGElement> {
    /** A named export of `@interstellarforge/matter-icons`, e.g. `search` (tree-shakeable). */
    icon: IconDefinition;
    size?: number;
    /** Accessible name. Without it the icon is decorative and hidden from assistive technology. */
    label?: string;
  }

  let { icon, size = 18, label, class: className, ...rest }: Props = $props();
</script>

<svg
  {...rest}
  class={["m-icon", className]}
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.8"
  stroke-linecap="round"
  stroke-linejoin="round"
  focusable="false"
  role={label ? "img" : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : true}
>
  <!-- Static markup from our own, SVGO-optimised icon sources. -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted static icon markup -->
  {@html icon.body}
</svg>
