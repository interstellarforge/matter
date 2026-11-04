"use client";

import { useId, useState } from "react";

import { ProgressBar } from "./Feedback.tsx";

export interface UploadFile {
  id: string;
  name: string;
  /** 0-100; omit when not uploading. */
  progress?: number;
  /** Error text for this file. */
  error?: string;
  /** Object or data URL for an image preview. */
  previewUrl?: string;
}

export interface FileUploadProps {
  /** Prompt inside the drop area, e.g. "Drop files or choose". Also the input's accessible name. */
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

/** Native `<input type=file>` inside a label: click, keyboard and screen readers work; drag-and-drop is additive. */
export function FileUpload({
  label,
  hint,
  accept,
  multiple,
  disabled,
  files = [],
  onFilesAdded,
  onRemove,
  removeLabel,
  progressLabel,
}: FileUploadProps) {
  const id = useId();
  const [dragging, setDragging] = useState(false);

  function add(list: FileList | null) {
    const picked = [...(list ?? [])];
    if (picked.length > 0) {
      onFilesAdded(multiple ? picked : picked.slice(0, 1));
    }
  }

  return (
    <div className="m-dropzone">
      <label
        className="m-dropzone__area"
        data-dragging={dragging ? "" : undefined}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) {
            setDragging(true);
          }
        }}
        onDragLeave={() => {
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) {
            add(event.dataTransfer.files);
          }
        }}
      >
        <input
          className="m-dropzone__input"
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(event) => {
            add(event.target.files);
            event.target.value = "";
          }}
        />
        <span>{label}</span>
        {hint ? <span id={`${id}-hint`}>{hint}</span> : undefined}
      </label>
      {files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file.id} className="m-dropzone__file">
              {file.previewUrl ? (
                <img src={file.previewUrl} alt="" />
              ) : (
                <span />
              )}
              <span>{file.name}</span>
              {onRemove ? (
                <button
                  type="button"
                  className="m-button"
                  data-variant="ghost"
                  data-icon-only=""
                  aria-label={removeLabel?.(file.name) ?? file.name}
                  onClick={() => {
                    onRemove(file.id);
                  }}
                >
                  <span aria-hidden="true">×</span>
                </button>
              ) : undefined}
              {file.progress !== undefined && !file.error ? (
                <ProgressBar
                  label={progressLabel?.(file.name) ?? file.name}
                  value={file.progress}
                />
              ) : undefined}
              {file.error ? (
                <p className="m-field__error">{file.error}</p>
              ) : undefined}
            </li>
          ))}
        </ul>
      ) : undefined}
    </div>
  );
}
