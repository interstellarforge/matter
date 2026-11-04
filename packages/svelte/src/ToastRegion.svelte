<script lang="ts">
  import Toast from "./Toast.svelte";
  import type { ToastItem } from "./types.ts";

  interface Props {
    toasts: ToastItem[];
    onDismiss: (id: string) => void;
    /** Accessible name of each dismiss button. */
    dismissLabel: string;
  }

  /** Controlled stack of toasts; the app owns the list. Timers pause on hover and focus. */
  let { toasts, onDismiss, dismissLabel }: Props = $props();
</script>

<div class="m-toast-region">
  {#each toasts as toast (toast.id)}
    <Toast {toast} {onDismiss} {dismissLabel} />
  {/each}
</div>
