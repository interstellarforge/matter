<script lang="ts">
  import type { Snippet } from "svelte";

  import type { FieldControlProps } from "./types.ts";

  interface Props {
    label: string;
    /** Help text under the control. */
    hint?: string;
    /** Error text; also marks the control invalid. Say what to do, not just what is wrong. */
    error?: string;
    /** Visible text marking a required field, e.g. "(required)". Also sets `required` on the control. */
    requiredLabel?: string;
    class?: string;
    /** Receives the props to spread onto the control. */
    children: Snippet<[FieldControlProps]>;
  }

  let { label, hint, error, requiredLabel, class: className, children }: Props = $props();

  const id = $props.id();
  const hintId = $derived(`${id}-hint`);
  const errorId = $derived(`${id}-error`);
  const control = $derived<FieldControlProps>({
    id,
    "aria-describedby": [hint ? hintId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined,
    invalid: error ? true : undefined,
    required: requiredLabel ? true : undefined,
  });
</script>

<div class={["m-field", className]}>
  <label for={id} class="m-field__label">
    {label}{#if requiredLabel}<span class="m-field__required"> {requiredLabel}</span>{/if}
  </label>
  {@render children(control)}
  {#if hint}<p id={hintId} class="m-field__hint">{hint}</p>{/if}
  {#if error}<p id={errorId} class="m-field__error">{error}</p>{/if}
</div>
