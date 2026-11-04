"use client";

import {
  type ComponentProps,
  type KeyboardEvent,
  useEffect,
  useRef,
} from "react";

import { cx } from "./cx.ts";

const ITEMS = "button:not(:disabled), [role=menuitem]:not(:disabled)";

export interface ToolbarProps extends ComponentProps<"div"> {
  /** Accessible name of the toolbar (required). */
  label: string;
}

/** Toolbar with one tab stop; `←→`, `Home` and `End` move between its buttons. */
export function Toolbar({
  label,
  className,
  onKeyDown,
  ...rest
}: ToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Roving tabindex, re-applied each render because consumers add and remove buttons.
  useEffect(() => {
    const items = [
      ...(ref.current?.querySelectorAll<HTMLElement>(ITEMS) ?? []),
    ];
    const active = items.find((el) => el.tabIndex === 0) ?? items[0];
    for (const el of items) el.tabIndex = el === active ? 0 : -1;
  });

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const items = [...event.currentTarget.querySelectorAll<HTMLElement>(ITEMS)];
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    const next = {
      ArrowRight: (index + 1) % items.length,
      ArrowLeft: (index - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    }[event.key];
    const target = next === undefined ? undefined : items[next];
    if (!target) return;
    event.preventDefault();
    for (const el of items) el.tabIndex = -1;
    target.tabIndex = 0;
    target.focus();
  }

  return (
    <div
      {...rest}
      ref={ref}
      role="toolbar"
      aria-label={label}
      className={cx("m-toolbar", className)}
      onKeyDown={handleKeyDown}
    />
  );
}

export interface EditorFrameProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  /** `Toolbar` with its buttons. */
  toolbar?: React.ReactNode;
  /** The consumer's editor engine (Lexical, Tiptap, ...). Give its editable `className="m-editor__content"`. */
  children?: React.ReactNode;
  invalid?: boolean;
  disabled?: boolean;
}

/** Input-like surface (border, radius, focus, invalid, disabled) around a toolbar and an editor. */
export function EditorFrame({
  toolbar,
  children,
  invalid = false,
  disabled = false,
  className,
  ...rest
}: EditorFrameProps) {
  return (
    <div
      {...rest}
      className={cx("m-editor", className)}
      data-invalid={invalid ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
    >
      {toolbar}
      {children}
    </div>
  );
}

/** Typography for rich text: headings, paragraphs, lists, quotes, code, links. Usable on its own for display. */
export function Prose({ className, ...rest }: ComponentProps<"div">) {
  return <div {...rest} className={cx("m-prose", className)} />;
}
