<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Visible heading; also the accessible name. */
    title: string;
    /** Accessible name of the close button. */
    closeLabel: string;
    children?: Snippet;
    footer?: Snippet;
  }

  let {
    open = $bindable(false),
    onOpenChange,
    title,
    closeLabel,
    children,
    footer,
  }: Props = $props();

  const titleId = $props.id();
  let dialog: HTMLDialogElement | undefined = $state();

  /** Modal dialog on the native `<dialog>`: focus trap, Esc and inert background come from the platform. */
  $effect(() => {
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  });

  function setOpen(next: boolean) {
    open = next;
    onOpenChange?.(next);
  }
</script>

<dialog
  bind:this={dialog}
  class="m-dialog"
  aria-labelledby={titleId}
  onclose={() => {
    setOpen(false);
  }}
  onclick={(event) => {
    if (event.target === event.currentTarget) {
      setOpen(false);
    }
  }}
>
  <div class="m-dialog__header">
    <h2 id={titleId} class="m-dialog__title">{title}</h2>
    <button
      type="button"
      class="m-button"
      data-variant="ghost"
      data-icon-only=""
      aria-label={closeLabel}
      onclick={() => {
        setOpen(false);
      }}
    >
      <span aria-hidden="true">×</span>
    </button>
  </div>
  <div class="m-dialog__body">{@render children?.()}</div>
  {#if footer}<div class="m-dialog__footer">{@render footer()}</div>{/if}
</dialog>
