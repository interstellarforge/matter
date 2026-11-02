<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  import Button from "./Button.svelte";
  import type { ButtonVariant, ControlSize } from "./types.ts";

  interface Props extends Omit<HTMLButtonAttributes, "aria-label"> {
    /** Accessible name; required because the button has no visible text. */
    label: string;
    variant?: ButtonVariant;
    size?: ControlSize;
    loading?: boolean;
    children?: Snippet;
  }

  let { label, children, ...rest }: Props = $props();
</script>

<Button {...rest} aria-label={label} data-icon-only="">
  {@render children?.()}
</Button>
