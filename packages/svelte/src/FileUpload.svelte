<script lang="ts">
  import ProgressBar from "./ProgressBar.svelte";
  import type { UploadFile } from "./types.ts";

  interface Props {
    /** Prompt inside the drop area, e.g. "Drop files or choose". */
    label: string;
    hint?: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    files?: UploadFile[];
    onFilesAdded: (files: File[]) => void;
    onRemove?: (id: string) => void;
    /** Accessible name of the remove button, e.g. `(name) => "Remove " + name`. */
    removeLabel?: (name: string) => string;
    /** Accessible name of a file's progress bar. */
    progressLabel?: (name: string) => string;
  }

  let {
    label,
    hint,
    accept,
    multiple = false,
    disabled = false,
    files = [],
    onFilesAdded,
    onRemove,
    removeLabel,
    progressLabel,
  }: Props = $props();

  const id = $props.id();
  let dragging = $state(false);

  function add(list: FileList | null) {
    const picked = [...(list ?? [])];
    if (picked.length > 0) {
      onFilesAdded(multiple ? picked : picked.slice(0, 1));
    }
  }
</script>

<!-- Native file input inside a label: click, keyboard and screen readers work; drag-and-drop is additive. -->
<div class="m-dropzone">
  <label
    class="m-dropzone__area"
    data-dragging={dragging ? "" : undefined}
    ondragover={(event) => {
      event.preventDefault();
      if (!disabled) {
        dragging = true;
      }
    }}
    ondragleave={() => (dragging = false)}
    ondrop={(event) => {
      event.preventDefault();
      dragging = false;
      if (!disabled) {
        add(event.dataTransfer?.files ?? null);
      }
    }}
  >
    <input
      class="m-dropzone__input"
      type="file"
      {accept}
      {multiple}
      {disabled}
      aria-describedby={hint ? `${id}-hint` : undefined}
      onchange={(event) => {
        add(event.currentTarget.files);
        event.currentTarget.value = "";
      }}
    />
    <span>{label}</span>
    {#if hint}<span id={`${id}-hint`}>{hint}</span>{/if}
  </label>
  {#if files.length > 0}
    <ul>
      {#each files as file (file.id)}
        <li class="m-dropzone__file">
          {#if file.previewUrl}<img src={file.previewUrl} alt="" />{:else}<span></span>{/if}
          <span>{file.name}</span>
          {#if onRemove}
            <button
              type="button"
              class="m-button"
              data-variant="ghost"
              data-icon-only=""
              aria-label={removeLabel?.(file.name) ?? file.name}
              onclick={() => { onRemove(file.id); }}
            >
              <span aria-hidden="true">×</span>
            </button>
          {/if}
          {#if file.progress !== undefined && !file.error}
            <ProgressBar label={progressLabel?.(file.name) ?? file.name} value={file.progress} />
          {/if}
          {#if file.error}<p class="m-field__error">{file.error}</p>{/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
