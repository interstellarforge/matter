<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    content: string;
    /** Receives the props the trigger must spread (`aria-describedby`). */
    children: Snippet<[{ "aria-describedby": string }]>;
  }

  /** Opens on hover and focus; Esc dismisses. Placement is fixed to the top in the MVP (no collision handling). */
  let { content, children }: Props = $props();

  const id = $props.id();
  let open = $state(false);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
  class="m-tooltip-wrap"
  onmouseenter={() => (open = true)}
  onmouseleave={() => (open = false)}
  onfocusin={() => (open = true)}
  onfocusout={() => (open = false)}
  onkeydown={(event) => {
    if (event.key === "Escape") {
      open = false;
    }
  }}
>
  {@render children({ "aria-describedby": id })}
  <span {id} role="tooltip" class="m-tooltip" hidden={!open}>{content}</span>
</span>
