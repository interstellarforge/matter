"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export type ToastTone = "info" | "success" | "warning" | "danger";

export interface ToastItem {
  id: string;
  tone?: ToastTone;
  title?: string;
  message: ReactNode;
  /** Optional action, e.g. "Undo". */
  action?: { label: string; onAction: () => void };
  /** Milliseconds before auto-dismiss; default 5000, `0` keeps it until dismissed. */
  duration?: number;
}

export interface ToastRegionProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  /** Accessible name of each dismiss button. */
  dismissLabel: string;
}

function Toast({
  toast,
  onDismiss,
  dismissLabel,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
  dismissLabel: string;
}) {
  const { id, tone = "info", title, message, action, duration = 5000 } = toast;
  const [paused, setPaused] = useState(false);
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;

  useEffect(() => {
    if (paused || duration === 0) {
      return;
    }
    const timer = setTimeout(() => {
      dismiss.current(id);
    }, duration);
    return () => {
      clearTimeout(timer);
    };
  }, [paused, duration, id]);

  const pause = () => {
    setPaused(true);
  };
  const resume = () => {
    setPaused(false);
  };

  return (
    <div
      className="m-toast"
      data-tone={tone}
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div>
        {title ? <div className="m-toast__title">{title}</div> : undefined}
        {message}
      </div>
      <button
        type="button"
        className="m-button"
        data-variant="ghost"
        data-icon-only=""
        aria-label={dismissLabel}
        onClick={() => {
          onDismiss(id);
        }}
      >
        <span aria-hidden="true">×</span>
      </button>
      {action ? (
        <button
          type="button"
          className="m-button"
          data-variant="ghost"
          data-size="sm"
          onClick={() => {
            action.onAction();
            onDismiss(id);
          }}
        >
          {action.label}
        </button>
      ) : undefined}
    </div>
  );
}

/** Controlled stack of toasts; the app owns the list. Timers pause on hover and focus. */
export function ToastRegion({
  toasts,
  onDismiss,
  dismissLabel,
}: ToastRegionProps) {
  return (
    <div className="m-toast-region">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          dismissLabel={dismissLabel}
        />
      ))}
    </div>
  );
}
