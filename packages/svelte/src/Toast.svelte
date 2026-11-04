<script lang="ts">
  import type { ToastItem } from "./types.ts";

  interface Props {
    toast: ToastItem;
    onDismiss: (id: string) => void;
    /** Accessible name of the dismiss button. */
    dismissLabel: string;
  }

  let { toast, onDismiss, dismissLabel }: Props = $props();

  let paused = $state(false);
  const tone = $derived(toast.tone ?? "info");

  $effect(() => {
    const duration = toast.duration ?? 5000;
    if (paused || duration === 0) {
      return;
    }
    const id = toast.id;
    const timer = setTimeout(() => { onDismiss(id); }, duration);
    return () => { clearTimeout(timer); };
  });
</script>

<div
  class="m-toast"
  data-tone={tone}
  role={tone === "danger" || tone === "warning" ? "alert" : "status"}
  onmouseenter={() => (paused = true)}
  onmouseleave={() => (paused = false)}
  onfocusin={() => (paused = true)}
  onfocusout={() => (paused = false)}
>
  <div>
    {#if toast.title}<div class="m-toast__title">{toast.title}</div>{/if}
    {toast.message}
  </div>
  <button
    type="button"
    class="m-button"
    data-variant="ghost"
    data-icon-only=""
    aria-label={dismissLabel}
    onclick={() => { onDismiss(toast.id); }}
  >
    <span aria-hidden="true">×</span>
  </button>
  {#if toast.action}
    {@const action = toast.action}
    <button
      type="button"
      class="m-button"
      data-variant="ghost"
      data-size="sm"
      onclick={() => {
        action.onAction();
        onDismiss(toast.id);
      }}
    >
      {action.label}
    </button>
  {/if}
</div>
