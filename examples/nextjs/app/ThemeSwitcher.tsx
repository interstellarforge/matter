"use client";

import { Select } from "@interstellarforge/matter-react";
import { useSyncExternalStore } from "react";

const keys = ["theme", "color-mode", "density"] as const;
type Key = (typeof keys)[number];

const options: Record<Key, string[]> = {
  theme: ["deep-space", "professional", "pulsar"],
  "color-mode": ["system", "light", "dark"],
  density: ["comfortable", "compact", "touch"],
};

function read(key: Key): string {
  return (
    document.documentElement.getAttribute(`data-${key}`) ??
    (key === "color-mode" ? "system" : (options[key][0] ?? ""))
  );
}

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true });
  return () => {
    observer.disconnect();
  };
}

function apply(key: Key, value: string) {
  if (value === "system") {
    document.documentElement.removeAttribute(`data-${key}`);
    localStorage.removeItem(`matter-${key}`);
  } else {
    document.documentElement.setAttribute(`data-${key}`, value);
    localStorage.setItem(`matter-${key}`, value);
  }
}

export function ThemeSwitcher() {
  return (
    <div style={{ display: "flex", gap: "var(--m-space-3)", flexWrap: "wrap" }}>
      {keys.map((key) => (
        <Switcher key={key} name={key} />
      ))}
    </div>
  );
}

function Switcher({ name }: { name: Key }) {
  // Server snapshot is the default; the init script may already have changed the attribute.
  const value = useSyncExternalStore(
    subscribe,
    () => read(name),
    () => options[name][0] ?? "",
  );
  return (
    <label style={{ display: "grid", gap: "var(--m-space-1)" }}>
      <span
        style={{ color: "var(--m-text-muted)", fontSize: "var(--m-fs-sm)" }}
      >
        {name}
      </span>
      <Select
        aria-label={name}
        value={value}
        onChange={(event) => {
          apply(name, event.target.value);
        }}
      >
        {options[name].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </label>
  );
}
