"use client";

import type { ReactNode } from "react";
import { useId, useState } from "react";

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  /** Decorative; the label stays available to assistive tech when collapsed. */
  icon?: ReactNode;
  current?: boolean;
}

export interface SidebarGroup {
  id: string;
  /** Group heading; omit for an unlabelled group. */
  label?: string;
  items: SidebarItem[];
  /** Heading becomes a toggle button. */
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export interface SidebarProps {
  /** Accessible name of the nav landmark. */
  label: string;
  groups: SidebarGroup[];
  /** Icon-only rail: labels stay in the DOM but are visually hidden. */
  collapsed?: boolean;
}

function Group({ group }: { group: SidebarGroup }) {
  const listId = useId();
  const [open, setOpen] = useState(group.defaultOpen ?? true);
  return (
    <div className="m-sidebar__group">
      {group.label ? (
        group.collapsible ? (
          <button
            type="button"
            className="m-sidebar__heading"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => {
              setOpen(!open);
            }}
          >
            {group.label}
            <span aria-hidden="true">{open ? "−" : "+"}</span>
          </button>
        ) : (
          <div className="m-sidebar__heading">{group.label}</div>
        )
      ) : undefined}
      <ul id={listId} hidden={group.collapsible && !open}>
        {group.items.map((item) => (
          <li key={item.id}>
            <a
              className="m-sidebar__link"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
            >
              {item.icon}
              <span className="m-sidebar__text">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sidebar({ label, groups, collapsed }: SidebarProps) {
  return (
    <nav
      className="m-sidebar"
      aria-label={label}
      data-collapsed={collapsed ? "" : undefined}
    >
      {groups.map((group) => (
        <Group key={group.id} group={group} />
      ))}
    </nav>
  );
}
