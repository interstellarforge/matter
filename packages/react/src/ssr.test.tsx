import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  Input,
  Menu,
  Switch,
  Tabs,
  Tooltip,
} from "./index.ts";

describe("server rendering", () => {
  it("renders every component to a string without touching the DOM", () => {
    expect.hasAssertions();

    const html = renderToString(
      <>
        <Button variant="primary">Go</Button>
        <Input aria-label="Name" />
        <Checkbox>Accept</Checkbox>
        <Switch aria-label="Remote" defaultChecked />
        <Badge tone="info">New</Badge>
        <Tabs
          label="Sections"
          items={[{ id: "a", label: "A", content: "Panel" }]}
        />
        <Dialog
          open={false}
          onOpenChange={() => undefined}
          title="T"
          closeLabel="Close"
        >
          Body
        </Dialog>
        <Tooltip content="Hint">
          <button type="button">Trigger</button>
        </Tooltip>
        <Menu
          triggerLabel="Actions"
          items={[{ id: "a", label: "A" }]}
          onSelect={() => undefined}
        />
      </>,
    );

    for (const fragment of [
      'class="m-button"',
      'data-variant="primary"',
      'role="switch"',
      'aria-checked="true"',
      'role="tablist"',
      "m-dialog",
      'role="tooltip"',
      'aria-haspopup="menu"',
    ]) {
      expect(html).toContain(fragment);
    }
  });

  it("produces stable ids so hydration does not mismatch", () => {
    expect.hasAssertions();

    const render = () =>
      renderToString(
        <Tabs
          label="Sections"
          items={[{ id: "a", label: "A", content: "x" }]}
        />,
      );

    expect(render()).toBe(render());
  });
});
