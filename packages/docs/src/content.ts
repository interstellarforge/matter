/** Component documentation. The contract (specs/components) stays the source of truth; this is the reader-facing version. */
export interface Example {
  title: string;
  note?: string;
  html: string;
  react: string;
  svelte: string;
  /** Wrapper hint for demos that need room (open menus, dialogs). */
  tall?: boolean;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  description: string;
  status: "stable" | "beta";
  /** Demos that need room (open menus, dialogs). */
  tall?: boolean;
  useWhen: string[];
  dontUseWhen: string[];
  examples: Example[];
  configurations: { title: string; body: string }[];
  accessibility: string[];
  keyboard?: [key: string, action: string][];
  props: [name: string, type: string, defaultValue: string, text: string][];
}

const icon = (path: string) =>
  `<svg class="m-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const searchIcon = icon(
  '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
);

export const components: ComponentDoc[] = [
  {
    slug: "button",
    name: "Button",
    description:
      "Runs an action when pressed, such as saving, confirming a decision or opening a dialog.",
    status: "stable",
    useWhen: [
      "Triggering an action: submit a form, save, open a dialog, confirm.",
    ],
    dontUseWhen: [
      "Navigating to another page. Use a link: buttons do something, links go somewhere.",
    ],
    examples: [
      {
        title: "Variants",
        html: `<button class="m-button" data-variant="primary">Save</button>
<button class="m-button" data-variant="secondary">Cancel</button>
<button class="m-button" data-variant="ghost">Skip</button>
<button class="m-button" data-variant="danger">Delete</button>`,
        react: `<Button variant="primary">Save</Button>
<Button>Cancel</Button>
<Button variant="ghost">Skip</Button>
<Button variant="danger">Delete</Button>`,
        svelte: `<Button variant="primary">Save</Button>
<Button>Cancel</Button>
<Button variant="ghost">Skip</Button>
<Button variant="danger">Delete</Button>`,
      },
      {
        title: "Sizes",
        html: `<button class="m-button" data-size="sm">Small</button>
<button class="m-button" data-size="md">Medium</button>
<button class="m-button" data-size="lg">Large</button>`,
        react: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
        svelte: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
      },
      {
        title: "Loading",
        note: "A loading button stays focusable and ignores clicks, so keyboard users keep their place.",
        html: `<button class="m-button" data-variant="primary" aria-busy="true" aria-disabled="true">Saving</button>`,
        react: `<Button variant="primary" loading>Saving</Button>`,
        svelte: `<Button variant="primary" loading>Saving</Button>`,
      },
      {
        title: "Icon only",
        html: `<button class="m-button" data-icon-only aria-label="Search">${searchIcon}</button>`,
        react: `<IconButton label="Search"><Icon icon={search} /></IconButton>`,
        svelte: `<IconButton label="Search"><Icon icon={search} /></IconButton>`,
      },
    ],
    configurations: [
      {
        title: "Variant",
        body: "Primary is the single most important action in a section: use one per container. Secondary is the default. Ghost is for supporting actions that must not compete. Danger is for actions that remove something that is hard to recover; always ask for confirmation first.",
      },
      {
        title: "Size",
        body: "Size follows the density of the page (compact, comfortable, touch). Use `sm` and `lg` only to align with neighbouring controls.",
      },
      {
        title: "Icons",
        body: "Place the icon before the label. Use icons to reinforce an action, not as decoration. Icon-only buttons need a `label`.",
      },
      {
        title: "No disabled state",
        body: "A button announces itself as busy with `loading`; for validation, leave the button active and explain what is missing next to it. Greyed-out controls fail contrast, cannot receive focus and give no reason.",
      },
    ],
    accessibility: [
      "Native `<button>`: Enter and Space activate it.",
      "`loading` sets `aria-busy` and `aria-disabled` while keeping the button focusable.",
      "Icon-only buttons require an accessible name through `label`.",
      "Focus ring uses `--m-focus` and meets 3:1 contrast on every theme.",
    ],
    props: [
      [
        "variant",
        '"primary" | "secondary" | "ghost" | "danger"',
        '"secondary"',
        "Visual priority.",
      ],
      [
        "size",
        '"sm" | "md" | "lg"',
        '"md"',
        "Control height; follows density.",
      ],
      ["loading", "boolean", "false", "Shows busy state and ignores clicks."],
      [
        "…rest",
        "button attributes",
        "",
        "Passed to the `<button>` (`type`, `onClick`, `form`, …).",
      ],
    ],
  },
  {
    slug: "input",
    name: "Input",
    description:
      "Single-line text field, with an optional leading icon. Also covers Textarea and Select, which share its styling.",
    status: "stable",
    useWhen: [
      "Collecting short free text, search terms, numbers or email addresses.",
      "Textarea for longer text, Select for choosing one option from a short list.",
    ],
    dontUseWhen: [
      "Choosing between two or three visible options. Use a checkbox or switch.",
    ],
    examples: [
      {
        title: "Default and invalid",
        html: `<input class="m-input" aria-label="Name" placeholder="Name">
<input class="m-input" aria-label="Email" aria-invalid="true" value="not-an-email">`,
        react: `<Input aria-label="Name" placeholder="Name" />
<Input aria-label="Email" invalid defaultValue="not-an-email" />`,
        svelte: `<Input aria-label="Name" placeholder="Name" />
<Input aria-label="Email" invalid value="not-an-email" />`,
      },
      {
        title: "With icon",
        html: `<span class="m-input-icon">${searchIcon}<input class="m-input" aria-label="Search" placeholder="Search"></span>`,
        react: `<Input aria-label="Search" icon={search} placeholder="Search" />`,
        svelte: `<Input aria-label="Search" icon={search} placeholder="Search" />`,
      },
      {
        title: "Textarea and Select",
        html: `<textarea class="m-input m-textarea" aria-label="Notes" placeholder="Notes"></textarea>
<select class="m-input m-select" aria-label="Type"><option>Full-time</option><option>Part-time</option></select>`,
        react: `<Textarea aria-label="Notes" placeholder="Notes" />
<Select aria-label="Type">
  <option>Full-time</option>
  <option>Part-time</option>
</Select>`,
        svelte: `<Textarea aria-label="Notes" placeholder="Notes" />
<Select aria-label="Type">
  <option>Full-time</option>
  <option>Part-time</option>
</Select>`,
      },
    ],
    configurations: [
      {
        title: "Invalid",
        body: "`invalid` sets `aria-invalid` and the error border. Always pair it with a text message next to the field; colour alone is not enough. See the Forms pattern.",
      },
      {
        title: "Icon",
        body: "The leading icon is decorative. The input still needs its own label (`aria-label` or a `<label>`).",
      },
    ],
    accessibility: [
      "Every field needs a visible `<label>` or an `aria-label`.",
      "Placeholder text is a hint, not a label: it disappears on input and has lower contrast.",
      "Invalid fields expose `aria-invalid`; describe the error with `aria-describedby`.",
    ],
    props: [
      [
        "invalid",
        "boolean",
        "false",
        "Sets `aria-invalid` and the error border.",
      ],
      ["icon", "IconDefinition", "", "Leading decorative icon (Input only)."],
      ["…rest", "input attributes", "", "Passed to the native element."],
    ],
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    description: "Lets people pick one or more options from a visible list.",
    status: "stable",
    useWhen: [
      "Selecting any number of options from a list.",
      "Confirming a single statement.",
    ],
    dontUseWhen: ["Turning a setting on or off immediately. Use a Switch."],
    examples: [
      {
        title: "States",
        html: `<label class="m-checkbox"><input type="checkbox"><span>Unchecked</span></label>
<label class="m-checkbox"><input type="checkbox" checked><span>Checked</span></label>
<label class="m-checkbox"><input type="checkbox" disabled><span>Disabled</span></label>`,
        react: `<Checkbox>Unchecked</Checkbox>
<Checkbox defaultChecked>Checked</Checkbox>
<Checkbox disabled>Disabled</Checkbox>`,
        svelte: `<Checkbox>Unchecked</Checkbox>
<Checkbox checked>Checked</Checkbox>
<Checkbox disabled>Disabled</Checkbox>`,
      },
    ],
    configurations: [
      {
        title: "Indeterminate",
        body: "Use `indeterminate` on a parent checkbox when only some of its children are selected. Clicking it resolves to checked.",
      },
    ],
    accessibility: [
      "Native `input[type=checkbox]`; Space toggles.",
      "The label text is part of the click target.",
    ],
    keyboard: [["Space", "Toggle"]],
    props: [
      ["indeterminate", "boolean", "false", "Partial selection."],
      ["invalid", "boolean", "false", "Error border and `aria-invalid`."],
      [
        "…rest",
        "input attributes",
        "",
        "`checked`, `defaultChecked`, `onChange`, …",
      ],
    ],
  },
  {
    slug: "switch",
    name: "Switch",
    description: "Turns a single setting on or off, with immediate effect.",
    status: "stable",
    useWhen: ["A setting that applies as soon as it is toggled."],
    dontUseWhen: ["A choice that is submitted with a form. Use a Checkbox."],
    examples: [
      {
        title: "Default",
        html: `<button class="m-switch" role="switch" aria-checked="false" aria-label="Remote only" data-demo="switch"></button>
<button class="m-switch" role="switch" aria-checked="true" aria-label="Notifications" data-demo="switch"></button>`,
        react: `<Switch aria-label="Remote only" />
<Switch aria-label="Notifications" defaultChecked />`,
        svelte: `<Switch aria-label="Remote only" />
<Switch aria-label="Notifications" bind:checked={notifications} />`,
      },
    ],
    configurations: [
      {
        title: "Controlled",
        body: "Pass `checked` and `onCheckedChange` to control it; without `checked` it keeps its own state (`defaultChecked`).",
      },
    ],
    accessibility: [
      "`role=switch` with `aria-checked`. A switch needs an accessible name.",
      "State is also visible through position, not only colour.",
    ],
    keyboard: [["Space / Enter", "Toggle"]],
    props: [
      [
        "checked",
        "boolean",
        "false",
        "Controlled state; `bind:checked` in Svelte.",
      ],
      [
        "defaultChecked",
        "boolean",
        "false",
        "Initial state when uncontrolled.",
      ],
      [
        "onCheckedChange",
        "(checked: boolean) => void",
        "",
        "Called after each toggle.",
      ],
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    description: "A short status label, such as a state, category or count.",
    status: "stable",
    useWhen: [
      "Showing the status of an item next to its title.",
      "Categorising items in a list.",
    ],
    dontUseWhen: [
      "Showing a message to the user. Use a Banner.",
      "Triggering an action. Use a Button.",
    ],
    examples: [
      {
        title: "Tones",
        html: `<span class="m-badge">Neutral</span>
<span class="m-badge" data-tone="accent">Accent</span>
<span class="m-badge" data-tone="info">Info</span>
<span class="m-badge" data-tone="success">Success</span>
<span class="m-badge" data-tone="warning">Warning</span>
<span class="m-badge" data-tone="danger">Danger</span>`,
        react: `<Badge tone="success">Done</Badge>`,
        svelte: `<Badge tone="success">Done</Badge>`,
      },
    ],
    configurations: [
      {
        title: "Tone",
        body: "Tone adds meaning to the text, it never replaces it. The label must still be understandable in greyscale.",
      },
    ],
    accessibility: [
      "Status must also be readable as text; never rely on the tone colour alone.",
    ],
    props: [
      [
        "tone",
        '"neutral" | "accent" | "info" | "success" | "warning" | "danger"',
        '"neutral"',
        "Colour role.",
      ],
    ],
  },
  {
    slug: "banner",
    name: "Banner",
    description:
      "A message that stays in the page flow to inform, confirm or warn.",
    status: "stable",
    useWhen: [
      "Explaining something about the page or a form as a whole.",
      "Reporting the result of an action.",
    ],
    dontUseWhen: [
      "Short field-level errors. Show them next to the field.",
      "Marking an item's status. Use a Badge.",
    ],
    examples: [
      {
        title: "Tones",
        html: `<div class="m-banner" data-tone="info" role="status"><div class="m-banner__title">Heads up</div>Your trial ends in three days.</div>
<div class="m-banner" data-tone="success" role="status">Changes saved.</div>
<div class="m-banner" data-tone="warning" role="alert"><div class="m-banner__title">Check your input</div>Two fields need attention.</div>
<div class="m-banner" data-tone="danger" role="alert">Saving failed. Try again.</div>`,
        react: `<Banner tone="info" title="Heads up">Your trial ends in three days.</Banner>
<Banner tone="danger">Saving failed. Try again.</Banner>`,
        svelte: `<Banner tone="info" title="Heads up">Your trial ends in three days.</Banner>
<Banner tone="danger">Saving failed. Try again.</Banner>`,
      },
    ],
    configurations: [
      {
        title: "Tone",
        body: "Warning and danger are announced immediately (`role=alert`). Info and success are announced politely (`role=status`).",
      },
      {
        title: "Not dismissible",
        body: "The MVP banner has no close button. Remove it from the page when it no longer applies.",
      },
    ],
    accessibility: [
      "`alert` interrupts screen readers: use it only for warnings and errors.",
      "Keep the message short; put the next step in the text.",
    ],
    props: [
      [
        "tone",
        '"info" | "success" | "warning" | "danger"',
        '"info"',
        "Colour role and live-region politeness.",
      ],
      ["title", "ReactNode / string", "", "Optional bold heading."],
    ],
  },
  {
    slug: "progress-bar",
    name: "ProgressBar",
    description:
      "Shows how far a task has progressed, or that something is loading.",
    status: "stable",
    useWhen: [
      "A task with a known amount of work, such as an upload.",
      "An unknown wait: leave `value` out for the indeterminate bar.",
    ],
    dontUseWhen: ["Very short waits. Use a loading button."],
    examples: [
      {
        title: "Determinate and indeterminate",
        html: `<div class="m-progress" role="progressbar" aria-label="Upload" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" style="--m-progress:40%"><div class="m-progress__bar"></div></div>
<div class="m-progress" role="progressbar" aria-label="Loading"><div class="m-progress__bar"></div></div>`,
        react: `<ProgressBar label="Upload" value={40} />
<ProgressBar label="Loading" />`,
        svelte: `<ProgressBar label="Upload" value={40} />
<ProgressBar label="Loading" />`,
      },
    ],
    configurations: [
      {
        title: "Value",
        body: "The value is clamped between 0 and `max`. Under reduced motion the indeterminate animation is switched off.",
      },
    ],
    accessibility: [
      "`role=progressbar` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. The `label` is required.",
    ],
    props: [
      ["label", "string", "", "Accessible name (required)."],
      ["value", "number", "", "Omit for indeterminate."],
      ["max", "number", "100", "Upper bound."],
    ],
  },
  {
    slug: "avatar",
    name: "Avatar",
    description: "A person's photo, or their initials when there is none.",
    status: "stable",
    useWhen: ["Identifying a person in a list, comment or assignee field."],
    dontUseWhen: ["Showing a logo or product image."],
    examples: [
      {
        title: "Sizes",
        html: `<span class="m-avatar" data-size="sm" role="img" aria-label="Ada Lovelace">AL</span>
<span class="m-avatar" role="img" aria-label="Grace Hopper">GH</span>
<span class="m-avatar" data-size="lg" role="img" aria-label="Alan Turing">AT</span>`,
        react: `<Avatar name="Ada Lovelace" size="sm" />
<Avatar name="Grace Hopper" />
<Avatar name="Alan Turing" size="lg" src="/alan.jpg" />`,
        svelte: `<Avatar name="Ada Lovelace" size="sm" />
<Avatar name="Grace Hopper" />
<Avatar name="Alan Turing" size="lg" src="/alan.jpg" />`,
      },
    ],
    configurations: [
      {
        title: "Initials",
        body: "Initials come from the first two words of `name`.",
      },
    ],
    accessibility: [
      "The full name is the accessible name; the image itself is decorative.",
    ],
    props: [
      ["name", "string", "", "Full name (required)."],
      ["src", "string", "", "Image URL; initials are shown without it."],
      ["size", '"sm" | "md" | "lg"', '"md"', "Diameter."],
    ],
  },
  {
    slug: "empty-state",
    name: "EmptyState",
    description:
      "Explains why a list or page has no content and what to do next.",
    status: "stable",
    useWhen: ["A list with no items, or a search without results."],
    dontUseWhen: ["Errors. Use a Banner."],
    examples: [
      {
        title: "With action",
        html: `<div class="m-empty"><div class="m-empty__title">No results</div><div>Try a different filter.</div><button class="m-button">Clear filters</button></div>`,
        react: `<EmptyState title="No results" action={<Button>Clear filters</Button>}>
  Try a different filter.
</EmptyState>`,
        svelte: `<EmptyState title="No results">
  Try a different filter.
  {#snippet action()}<Button>Clear filters</Button>{/snippet}
</EmptyState>`,
      },
    ],
    configurations: [
      { title: "Action", body: "Offer at most one next step, as a Button." },
    ],
    accessibility: [
      "Plain text content; no live region. Announce result changes separately when they happen after user input.",
    ],
    props: [
      ["title", "string", "", "Heading (required)."],
      ["action", "ReactNode / Snippet", "", "Optional call to action."],
    ],
  },
  {
    slug: "card",
    name: "Card",
    description: "A bordered surface that groups related content.",
    status: "stable",
    useWhen: [
      "Grouping related content on a page, such as a form section or summary.",
    ],
    dontUseWhen: [
      "Making a whole region clickable. A card is not interactive; put a link or button inside.",
    ],
    examples: [
      {
        title: "Padded",
        html: `<div class="m-card" data-padded>Card content</div>`,
        react: `<Card padded>Card content</Card>
<Card as="section">Rendered as a section</Card>`,
        svelte: `<Card padded>Card content</Card>`,
      },
    ],
    configurations: [
      {
        title: "Element",
        body: "React accepts `as` to render another element (for example `section`).",
      },
    ],
    accessibility: [
      "A static container. Use headings inside to give the group a name.",
    ],
    props: [
      ["padded", "boolean", "false", "Adds inner spacing."],
      ["as", "ElementType", '"div"', "Rendered element (React)."],
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    description:
      "Switches between related panels of content in the same place.",
    status: "stable",
    useWhen: ["Two to six sibling views of the same subject."],
    dontUseWhen: [
      "Steps in a process. Use a stepper.",
      "Navigation between pages. Use links.",
    ],
    examples: [
      {
        title: "Default",
        html: `<div class="m-tabs" data-demo="tabs">
<div class="m-tablist" role="tablist" aria-label="Sections">
<button class="m-tab" role="tab" aria-selected="true">Overview</button>
<button class="m-tab" role="tab" aria-selected="false" tabindex="-1">Details</button>
<button class="m-tab" role="tab" aria-selected="false" tabindex="-1" disabled>Archived</button>
<button class="m-tab" role="tab" aria-selected="false" tabindex="-1">History</button>
</div>
<div class="m-tabpanel" role="tabpanel">Overview panel</div>
<div class="m-tabpanel" role="tabpanel" hidden>Details panel</div>
<div class="m-tabpanel" role="tabpanel" hidden>Archived panel</div>
<div class="m-tabpanel" role="tabpanel" hidden>History panel</div>
</div>`,
        react: `<Tabs
  label="Sections"
  items={[
    { id: "overview", label: "Overview", content: "Overview panel" },
    { id: "details", label: "Details", content: "Details panel" },
    { id: "archived", label: "Archived", content: "…", disabled: true },
  ]}
/>`,
        svelte: `<Tabs label="Sections" items={[{ id: "overview", label: "Overview" }, { id: "details", label: "Details" }]}>
  {#snippet panel(id)}Panel for {id}{/snippet}
</Tabs>`,
      },
    ],
    configurations: [
      {
        title: "Controlled",
        body: "Use `value` and `onValueChange` to control the selected tab, or `defaultValue` to choose the initial one.",
      },
      {
        title: "Disabled tab",
        body: "Disabled tabs are skipped by the arrow keys.",
      },
    ],
    accessibility: [
      "Roving tabindex: only the selected tab is in the tab order.",
      "Selecting follows focus; the panel is linked with `aria-controls`.",
      "A `label` names the tab list.",
    ],
    keyboard: [
      ["← →", "Previous / next enabled tab"],
      ["Home / End", "First / last tab"],
      ["Tab", "Move into the panel"],
    ],
    props: [
      ["label", "string", "", "Accessible name of the tab list (required)."],
      [
        "items",
        "TabItem[]",
        "",
        "`id`, `label`, `disabled`, and `content` (React).",
      ],
      ["value / defaultValue", "string", "first item", "Selected tab id."],
      [
        "onValueChange",
        "(id: string) => void",
        "",
        "Called when the selection changes.",
      ],
    ],
  },
  {
    slug: "dialog",
    name: "Dialog",
    description:
      "A modal window that asks for attention or input before the user continues.",
    status: "stable",
    useWhen: [
      "Confirming a destructive action.",
      "A short, focused task that must be completed or cancelled.",
    ],
    dontUseWhen: [
      "Long forms or content people need to compare with the page. Use a page.",
      "Non-blocking messages. Use a Banner.",
    ],
    tall: true,
    examples: [
      {
        title: "Modal dialog",
        note: "Built on the native `<dialog>` element: focus trap, Esc and an inert background come from the platform.",
        html: `<button class="m-button" data-variant="primary" data-demo="dialog-open">Open dialog</button>
<dialog class="m-dialog" aria-labelledby="dlg-title" data-demo="dialog">
<div class="m-dialog__header"><h2 id="dlg-title" class="m-dialog__title">Settings</h2><button class="m-button" data-icon-only aria-label="Close" data-demo="dialog-close">×</button></div>
<div class="m-dialog__body">Dialog body</div>
<div class="m-dialog__footer"><button class="m-button" data-demo="dialog-close">Done</button></div>
</dialog>`,
        react: `<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Settings"
  closeLabel="Close"
  footer={<Button onClick={() => setOpen(false)}>Done</Button>}
>
  Dialog body
</Dialog>`,
        svelte: `<Dialog bind:open title="Settings" closeLabel="Close">
  Dialog body
  {#snippet footer()}<Button onclick={() => (open = false)}>Done</Button>{/snippet}
</Dialog>`,
      },
    ],
    configurations: [
      {
        title: "Title and close label",
        body: "Both are required. The title names the dialog (`aria-labelledby`); the close label names the close button.",
      },
      {
        title: "Footer",
        body: "Put the primary action last. A destructive dialog names the action on its button, not just “OK”.",
      },
    ],
    accessibility: [
      "`showModal()` traps focus and makes the rest of the page inert.",
      "Focus returns to the element that opened the dialog.",
      "Esc closes it.",
    ],
    keyboard: [
      ["Esc", "Close"],
      ["Tab / Shift+Tab", "Cycle inside the dialog"],
    ],
    props: [
      ["open", "boolean", "false", "Visibility."],
      [
        "onOpenChange",
        "(open: boolean) => void",
        "",
        "Called on close (Esc, close button).",
      ],
      ["title", "string", "", "Heading and accessible name (required)."],
      [
        "closeLabel",
        "string",
        "",
        "Accessible name of the close button (required).",
      ],
      ["footer", "ReactNode / Snippet", "", "Action area."],
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    description: "A short hint shown when an element is hovered or focused.",
    status: "stable",
    useWhen: [
      "Naming an icon-only button.",
      "Adding a short extra hint that is not essential.",
    ],
    dontUseWhen: [
      "Essential information or instructions. Show them in the page.",
      "Anything interactive inside the tooltip.",
    ],
    tall: true,
    examples: [
      {
        title: "On an icon button",
        note: "Hover or focus the button.",
        html: `<span class="m-tooltip-wrap" data-demo="tooltip"><button class="m-button" data-icon-only aria-label="Search" aria-describedby="tip-1">${searchIcon}</button><span id="tip-1" role="tooltip" class="m-tooltip" hidden>Search everything</span></span>`,
        react: `<Tooltip content="Search everything">
  <IconButton label="Search"><Icon icon={search} /></IconButton>
</Tooltip>`,
        svelte: `<Tooltip content="Search everything">
  {#snippet children(props)}
    <IconButton label="Search" {...props}><Icon icon={search} /></IconButton>
  {/snippet}
</Tooltip>`,
      },
    ],
    configurations: [
      {
        title: "Placement",
        body: "The MVP shows the tooltip above the element and does not handle collisions with the viewport edge.",
      },
    ],
    accessibility: [
      "Opens on hover and keyboard focus, closes on blur, mouse leave and Esc.",
      "Linked with `aria-describedby`.",
      "Touch devices have no hover: never hide essential information in a tooltip.",
    ],
    keyboard: [
      ["Focus", "Show"],
      ["Esc", "Hide"],
    ],
    props: [
      ["content", "string", "", "Tooltip text."],
      ["placement", '"top"', '"top"', "Only top in the MVP."],
    ],
  },
  {
    slug: "menu",
    name: "Menu",
    description: "A list of actions opened from a button.",
    status: "stable",
    useWhen: ["Grouping three or more secondary actions behind one button."],
    dontUseWhen: [
      "Navigating between pages. Use links or tabs.",
      "One or two actions. Show them as buttons.",
    ],
    tall: true,
    examples: [
      {
        title: "Actions menu",
        html: `<div class="m-menu-wrap" data-demo="menu">
<button class="m-button" aria-haspopup="menu" aria-expanded="false">Actions</button>
<div class="m-menu" role="menu" hidden>
<button class="m-menu__item" role="menuitem">Edit</button>
<button class="m-menu__item" role="menuitem" disabled>Archive</button>
<button class="m-menu__item" role="menuitem">Delete</button>
</div></div>`,
        react: `<Menu
  triggerLabel="Actions"
  items={[
    { id: "edit", label: "Edit" },
    { id: "archive", label: "Archive", disabled: true },
    { id: "delete", label: "Delete" },
  ]}
  onSelect={(id) => run(id)}
/>`,
        svelte: `<Menu triggerLabel="Actions" items={[{ id: "edit", label: "Edit" }, { id: "delete", label: "Delete" }]} onSelect={(id) => run(id)} />`,
      },
    ],
    configurations: [
      {
        title: "Items",
        body: "Each item has an `id`, a `label` and may be `disabled`. Keep labels short and start with a verb.",
      },
    ],
    accessibility: [
      "Trigger uses `aria-haspopup=menu` and `aria-expanded`.",
      "Esc closes the menu and returns focus to the trigger; clicking outside closes it.",
    ],
    keyboard: [
      ["↓ / ↑", "Open, or move between items"],
      ["Home / End", "First / last item"],
      ["Type a letter", "Jump to matching item"],
      ["Enter / Space", "Choose"],
      ["Esc", "Close"],
    ],
    props: [
      ["triggerLabel", "string", "", "Text of the trigger button (required)."],
      ["items", "MenuItem[]", "", "`id`, `label`, `disabled`."],
      [
        "onSelect",
        "(id: string) => void",
        "",
        "Called with the chosen item id.",
      ],
    ],
  },
  {
    slug: "icon",
    name: "Icon",
    description:
      "One of 52 stroke icons, drawn on a 24px grid in the current text colour.",
    status: "stable",
    useWhen: ["Reinforcing a label or naming an icon-only control."],
    dontUseWhen: ["Decoration that adds no meaning."],
    examples: [
      {
        title: "Sizes and label",
        html: `${icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')}
<svg class="m-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Search"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
        react: `import { search } from "@interstellarforge/matter-icons";

<Icon icon={search} />
<Icon icon={search} size={28} label="Search" />`,
        svelte: `import { search } from "@interstellarforge/matter-icons";

<Icon icon={search} />
<Icon icon={search} size={28} label="Search" />`,
      },
    ],
    configurations: [
      {
        title: "Tree-shaking",
        body: "Import only the icons you use as named exports; unused icons are not bundled. The `icons` map and `IconName` type exist for dynamic lookups.",
      },
    ],
    accessibility: [
      "Without `label` the icon is decorative and hidden from assistive technology; with `label` it is an image with that name.",
    ],
    props: [
      [
        "icon",
        "IconDefinition",
        "",
        "Named export of matter-icons (required).",
      ],
      ["size", "number", "18", "Width and height in px."],
      ["label", "string", "", "Accessible name; omit for decorative icons."],
    ],
  },
];
