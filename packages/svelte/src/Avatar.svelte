<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    /** Full name: used as the accessible name and for the initials fallback. */
    name: string;
    src?: string;
    size?: "sm" | "md" | "lg";
  }

  let { name, src, size = "md", class: className, ...rest }: Props = $props();

  const initials = $derived(
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join(""),
  );
</script>

<span {...rest} class={["m-avatar", className]} data-size={size} role="img" aria-label={name}>
  {#if src}<img {src} alt="" />{:else}{initials}{/if}
</span>
