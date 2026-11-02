import { search } from "@interstellarforge/matter-icons";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { violations } from "./axe.ts";
import {
  Badge,
  Avatar,
  Banner,
  Button,
  Card,
  Checkbox,
  EmptyState,
  Icon,
  IconButton,
  Input,
  ProgressBar,
  Select,
  Switch,
  Textarea,
} from "./index.ts";

describe("form controls", () => {
  it("button blocks clicks while loading but stays focusable", async () => {
    expect.hasAssertions();

    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    await userEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
    expect(button).toHaveProperty("disabled", false);
    expect(button.getAttribute("aria-busy")).toBe("true");
  });

  it("icon button takes its accessible name from label", () => {
    expect.hasAssertions();

    render(<IconButton label="Close">×</IconButton>);

    expect(
      screen.getByRole("button", { name: "Close" }).dataset["iconOnly"],
    ).toBe("");
  });

  it("marks invalid fields with aria-invalid", () => {
    expect.hasAssertions();

    render(
      <>
        <Input aria-label="Name" invalid />
        <Textarea aria-label="Notes" invalid />
        <Select aria-label="Type" invalid>
          <option>A</option>
        </Select>
      </>,
    );

    expect(screen.getByLabelText("Name").getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(screen.getByLabelText("Notes").getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(screen.getByLabelText("Type").getAttribute("aria-invalid")).toBe(
      "true",
    );
  });

  it("checkbox toggles and supports indeterminate", async () => {
    expect.hasAssertions();

    render(<Checkbox indeterminate>Accept</Checkbox>);
    const box = screen.getByRole("checkbox", { name: "Accept" });

    expect(box).toHaveProperty("indeterminate", true);

    await userEvent.click(box);

    expect(box).toHaveProperty("checked", true);
    expect(box).toHaveProperty("indeterminate", false);
  });

  it("switch toggles with click and with the keyboard and reports changes", async () => {
    expect.hasAssertions();

    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Remote" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole("switch", { name: "Remote" });
    await userEvent.click(toggle);
    toggle.focus();
    await userEvent.keyboard(" ");

    expect(onCheckedChange).toHaveBeenNthCalledWith(1, true);
    expect(onCheckedChange).toHaveBeenNthCalledWith(2, false);
    expect(toggle.getAttribute("aria-checked")).toBe("false");
  });

  it("controlled switch follows the checked prop", async () => {
    expect.hasAssertions();

    render(
      <Switch aria-label="Controlled" checked onCheckedChange={vi.fn()} />,
    );
    await userEvent.click(screen.getByRole("switch"));

    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe(
      "true",
    );
  });

  it("has no axe violations for a composed form", async () => {
    expect.hasAssertions();

    const { container } = render(
      <form>
        <label htmlFor="n">Name</label>
        <Input id="n" />
        <Checkbox>Accept</Checkbox>
        <Switch aria-label="Remote" />
        <Input aria-label="Search" icon={search} />
        <Avatar name="Ada Lovelace" />
        <Banner tone="warning" title="Heads up">
          Check this
        </Banner>
        <ProgressBar label="Upload" value={40} />
        <EmptyState title="Nothing here">Add one</EmptyState>
        <Badge tone="success">Done</Badge>
        <Card padded>Content</Card>
        <Button variant="primary" type="submit">
          Send
        </Button>
      </form>,
    );

    expect(await violations(container)).toStrictEqual([]);
  });

  it("feedback components expose roles, initials and progress values", () => {
    expect.hasAssertions();

    render(
      <>
        <Avatar name="Ada Lovelace" />
        <Banner tone="danger">Failed</Banner>
        <Banner>Saved</Banner>
        <ProgressBar label="Upload" value={150} />
        <ProgressBar label="Loading" />
      </>,
    );

    expect(screen.getByRole("img", { name: "Ada Lovelace" }).textContent).toBe(
      "AL",
    );
    expect(screen.getByRole("alert").textContent).toBe("Failed");
    expect(screen.getByRole("status").textContent).toBe("Saved");
    expect(
      screen
        .getByRole("progressbar", { name: "Upload" })
        .style.getPropertyValue("--m-progress"),
    ).toBe("100%");
    expect(
      screen
        .getByRole("progressbar", { name: "Loading" })
        .hasAttribute("aria-valuenow"),
    ).toBe(false);
  });

  it("icon is decorative without a label and an image with one", () => {
    expect.hasAssertions();

    const { container } = render(
      <>
        <Icon icon={search} />
        <Icon icon={search} label="Search" />
      </>,
    );
    const [decorative] = container.querySelectorAll("svg");

    expect(decorative?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("img", { name: "Search" })).toBeTruthy();
  });
});
