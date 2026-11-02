"use client";

import { chevronDown, search } from "@interstellarforge/matter-icons";
import {
  Button,
  Checkbox,
  Dialog,
  Icon,
  IconButton,
  Menu,
  Switch,
  Tabs,
  Tooltip,
} from "@interstellarforge/matter-react";
import { useState } from "react";

export function Gallery() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState("none");
  return (
    <div style={{ display: "grid", gap: "var(--m-space-4)" }}>
      <div
        style={{
          display: "flex",
          gap: "var(--m-space-3)",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          Open dialog
        </Button>
        <Menu
          triggerLabel="Actions"
          items={[
            { id: "edit", label: "Edit" },
            { id: "archive", label: "Archive", disabled: true },
            { id: "delete", label: "Delete" },
          ]}
          onSelect={setLast}
        />
        <Tooltip content="Search everything">
          <IconButton label="Search">
            <Icon icon={search} />
          </IconButton>
        </Tooltip>
        <Switch aria-label="Remote only" />
        <Checkbox indeterminate>Select all</Checkbox>
        <Icon icon={chevronDown} label="Expand" />
        <span data-testid="last-action">Last action: {last}</span>
      </div>
      <Tabs
        label="Sections"
        items={[
          { id: "overview", label: "Overview", content: "Overview panel" },
          {
            id: "details",
            label: "Details",
            content: "Details panel",
            disabled: true,
          },
          { id: "history", label: "History", content: "History panel" },
        ]}
      />
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Settings"
        closeLabel="Close"
        footer={
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Done
          </Button>
        }
      >
        Dialog body
      </Dialog>
    </div>
  );
}
