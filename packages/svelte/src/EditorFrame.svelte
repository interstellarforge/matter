<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** `Toolbar` with its buttons. */
    toolbar?: Snippet;
    /** The consumer's editor engine. Give its editable `class="m-editor__content"`. */
    children?: Snippet;
    invalid?: boolean;
    disabled?: boolean;
  }

  /** Input-like surface (border, radius, focus, invalid, disabled) around a toolbar and an editor. */
  let {
    toolbar,
    children,
    invalid = false,
    disabled = false,
    class: className,
    ...rest
  }: Props = $props();
</script>

<div
  {...rest}
  class={["m-editor", className]}
  data-invalid={invalid ? "" : undefined}
  data-disabled={disabled ? "" : undefined}
>
  {@render toolbar?.()}
  {@render children?.()}
</div>
