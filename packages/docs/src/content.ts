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
const editorIcon = (path: string) => icon(path);
const editorButton = (
  cmd: string,
  label: string,
  path: string,
  toggle = true,
) =>
  `<button class="m-button" type="button" data-size="sm" data-icon-only data-cmd="${cmd}" aria-label="${label}"${toggle ? ' aria-pressed="false"' : ""}>${editorIcon(path)}</button>`;
const editorDemo = () =>
  `<div class="m-editor" data-demo="editor"><div class="m-toolbar" role="toolbar" aria-label="Formatting"><select class="m-input m-select" data-size="sm" aria-label="Text style" data-block style="inline-size:auto"><option value="p">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option></select><span class="m-toolbar__sep" role="separator"></span><div class="m-button-group" role="group" aria-label="Text">${editorButton("bold", "Bold", '<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"/>')}${editorButton("italic", "Italic", '<path d="M19 4h-9M14 20H5M15 4 9 20"/>')}${editorButton("underline", "Underline", '<path d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14"/>')}</div><div class="m-button-group" role="group" aria-label="Lists">${editorButton("insertUnorderedList", "Bulleted list", '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>')}${editorButton("insertOrderedList", "Numbered list", '<path d="M11 6h9M11 12h9M11 18h9M4 5l1.5-1v4M3.5 14.5a1.5 1.5 0 1 1 2.5 1.2L3.5 18H6.5"/>')}</div>${editorButton("quote", "Quote", '<path d="M9 7H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3v2a2 2 0 0 1-2 2M19 7h-3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3v2a2 2 0 0 1-2 2"/>')}${editorButton("link", "Link", '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>', false)}<span class="m-toolbar__sep" role="separator"></span>${editorButton("undo", "Undo", '<path d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>', false)}${editorButton("redo", "Redo", '<path d="m15 14 5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>', false)}</div><div class="m-editor__content m-prose" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Body" data-empty data-placeholder="Write something"></div><dialog class="m-dialog" aria-labelledby="link-title" data-link-dialog><form method="dialog"><div class="m-dialog__header"><h2 id="link-title" class="m-dialog__title">Insert link</h2></div><div class="m-dialog__body"><label for="link-url" style="display:block;margin-block-end:var(--m-space-2)">URL</label><input id="link-url" class="m-input" type="url" placeholder="https://" required data-link-url></div><div class="m-dialog__footer"><button class="m-button" data-variant="ghost" type="button" data-link-cancel>Cancel</button><button class="m-button" data-variant="primary" type="submit">Insert</button></div></form></dialog></div>`;
const searchIcon = icon(
  '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
);

/** Static November 2026 calendar (Monday start, 4th selected) for the date picker demo. */
const calendarDemo = () => {
  const cells = Array.from({ length: 42 }, (_, i) => {
    const day = new Date(2026, 9, 26 + i);
    const outside = day.getMonth() !== 10;
    const selected = day.getMonth() === 10 && day.getDate() === 4;
    return `<td role="gridcell" aria-selected="${String(selected)}"><button type="button" class="m-calendar__day" tabindex="${selected ? "0" : "-1"}"${outside ? " data-outside" : ""} aria-label="${day.toDateString()}">${String(day.getDate())}</button></td>`;
  });
  const weeks = Array.from(
    { length: 6 },
    (_, w) => `<tr>${cells.slice(w * 7, w * 7 + 7).join("")}</tr>`,
  ).join("");
  const nav = (dir: string, label: string) =>
    `<button type="button" class="m-calendar__nav"${dir ? ` data-dir="${dir}"` : ""} aria-label="${label}">${icon('<path d="m9 6 6 6-6 6"/>')}</button>`;
  return `<span class="m-datepicker"><input class="m-input" type="date" aria-label="Start date" value="2026-11-04">
<button type="button" class="m-datepicker__toggle" style="inset-block:4px auto;margin:0" aria-haspopup="dialog" aria-expanded="true" aria-label="Choose start date">${icon('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>')}</button>
<div class="m-calendar" role="dialog" aria-label="November 2026" style="position:static;margin-block-start:4px"><div class="m-calendar__header">${nav("prev", "Previous month")}<div class="m-calendar__title">November 2026</div>${nav("", "Next month")}</div>
<table role="grid" aria-label="November 2026"><thead><tr>${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => `<th scope="col">${d}</th>`).join("")}</tr></thead><tbody>${weeks}</tbody></table></div></span>`;
};

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
    slug: "form-field",
    name: "Form field",
    description:
      "Wires a label, a control, help text and an error message together.",
    status: "beta",
    useWhen: ["Any input, select, textarea or date field that needs a label."],
    dontUseWhen: [
      "A control that already has a visible label of its own, such as a checkbox.",
    ],
    examples: [
      {
        title: "Hint and error",
        html: `<div class="m-field">
<label class="m-field__label" for="ff-1">Email <span class="m-field__required">(required)</span></label>
<input class="m-input" id="ff-1" required aria-invalid="true" aria-describedby="ff-1-hint ff-1-error" value="ada@">
<p class="m-field__hint" id="ff-1-hint">Work address</p>
<p class="m-field__error" id="ff-1-error">Enter a full address, for example ada@example.com</p>
</div>`,
        react: `<FormField label="Email" hint="Work address" error={error} requiredLabel="(required)">
  {(control) => <Input {...control} type="email" />}
</FormField>`,
        svelte: `<FormField label="Email" hint="Work address" {error} requiredLabel="(required)">
  {#snippet children(control)}
    <Input {...control} type="email" />
  {/snippet}
</FormField>`,
      },
    ],
    configurations: [
      {
        title: "Required",
        body: '`requiredLabel` is visible text such as "(required)" and also sets `required` on the control. Never mark required with colour or an asterisk alone.',
      },
    ],
    accessibility: [
      "Label is linked with `for`; hint and error with `aria-describedby`.",
      "An error sets `aria-invalid` on the control. Say what to do, not just what is wrong.",
    ],
    props: [
      ["label", "ReactNode / string", "", "Visible label (required)."],
      ["hint", "ReactNode / string", "", "Help text under the control."],
      [
        "error",
        "ReactNode / string",
        "",
        "Error text; marks the control invalid.",
      ],
      ["requiredLabel", "string", "", "Visible text for required fields."],
      [
        "children",
        "(control) => node",
        "",
        "Receives `id`, `aria-describedby`, `invalid`, `required` to spread on the control.",
      ],
    ],
  },
  {
    slug: "data-table",
    name: "Data table",
    description:
      "A table with sortable columns, row selection and an optional sticky header.",
    status: "beta",
    useWhen: ["Comparing records across several attributes."],
    dontUseWhen: ["Layout, or a few key-value pairs. Use a list."],
    examples: [
      {
        title: "Sortable, selectable",
        html: `<div class="m-table-wrap" style="inline-size:100%"><table class="m-table"><caption>People</caption>
<thead><tr>
<th scope="col"><label class="m-checkbox"><input type="checkbox" aria-label="Select all"><span></span></label></th>
<th scope="col" aria-sort="ascending"><button class="m-table__sort" type="button">Name</button></th>
<th scope="col">Role</th></tr></thead>
<tbody>
<tr data-selected><td><label class="m-checkbox"><input type="checkbox" checked aria-label="Select Ada"><span></span></label></td><td>Ada</td><td>Engineer</td></tr>
<tr><td><label class="m-checkbox"><input type="checkbox" aria-label="Select Grace"><span></span></label></td><td>Grace</td><td>Admiral</td></tr>
</tbody></table></div>`,
        react: `<DataTable
  caption="People"
  rows={rows}
  columns={[
    { id: "name", header: "Name", sortable: true, cell: (r) => r.name },
    { id: "role", header: "Role", cell: (r) => r.role },
  ]}
  sort={sort}
  onSortChange={setSort}
  selected={selected}
  onSelectedChange={setSelected}
  selectAllLabel="Select all"
  selectRowLabel={(r) => \`Select \${r.name}\`}
/>`,
        svelte: `<DataTable caption="People" {rows} columns={[{ id: "name", header: "Name", sortable: true }, { id: "role", header: "Role" }]}
  {sort} onSortChange={(s) => (sort = s)} {selected} onSelectedChange={(s) => (selected = s)}
  selectAllLabel="Select all" selectRowLabel={(r) => \`Select \${r.name}\`}>
  {#snippet cell(row, column)}{row[column.id]}{/snippet}
</DataTable>`,
      },
    ],
    configurations: [
      {
        title: "Controlled",
        body: "The app sorts `rows` and owns `sort` and `selected`. Passing `onSelectedChange` adds the checkbox column. `maxHeight` makes the body scroll under a sticky header.",
      },
    ],
    accessibility: [
      "Native `table` semantics; `caption` is the accessible name (visually hidden).",
      "Sorted column has `aria-sort`; the sort control is a button inside the header.",
      "Select-all shows an indeterminate state.",
    ],
    props: [
      ["caption", "string", "", "Accessible name (required)."],
      [
        "columns",
        "DataTableColumn[]",
        "",
        "`id`, `header`, `sortable`, and `cell` (React).",
      ],
      ["rows", "Row[]", "", "Each row needs a string `id`."],
      ["sort / onSortChange", "DataTableSort", "", "Controlled sort."],
      [
        "selected / onSelectedChange",
        "string[]",
        "",
        "Controlled selection of row ids.",
      ],
      ["maxHeight", "string", "", "CSS length; enables the sticky header."],
    ],
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    description: "Side navigation with grouped, collapsible sections.",
    status: "beta",
    useWhen: ["Primary navigation of an app with several sections."],
    dontUseWhen: ["Switching views within one page. Use Tabs."],
    examples: [
      {
        title: "Groups and current item",
        html: `<nav class="m-sidebar" aria-label="Main">
<div class="m-sidebar__group"><div class="m-sidebar__heading">Content</div>
<ul><li><a class="m-sidebar__link" href="#" aria-current="page"><span class="m-sidebar__text">Pages</span></a></li>
<li><a class="m-sidebar__link" href="#"><span class="m-sidebar__text">Media</span></a></li></ul></div>
<div class="m-sidebar__group"><button class="m-sidebar__heading" type="button" aria-expanded="true">Settings <span aria-hidden="true">−</span></button>
<ul><li><a class="m-sidebar__link" href="#"><span class="m-sidebar__text">Users</span></a></li></ul></div>
</nav>`,
        react: `<Sidebar
  label="Main"
  groups={[
    { id: "content", label: "Content", items: [{ id: "pages", label: "Pages", href: "/pages", current: true }] },
    { id: "settings", label: "Settings", collapsible: true, items: [{ id: "users", label: "Users", href: "/users" }] },
  ]}
/>`,
        svelte: `<Sidebar label="Main" groups={groups} collapsed={collapsed} />`,
      },
    ],
    configurations: [
      {
        title: "Collapsed",
        body: "`collapsed` turns the sidebar into an icon rail. Labels stay in the DOM but are visually hidden, so give each item an icon.",
      },
    ],
    accessibility: [
      'A `nav` landmark named by `label`; the current page has `aria-current="page"`.',
      "Collapsible group headings are buttons with `aria-expanded`.",
    ],
    props: [
      ["label", "string", "", "Accessible name of the landmark (required)."],
      [
        "groups",
        "SidebarGroup[]",
        "",
        "`id`, `label`, `items`, `collapsible`, `defaultOpen`.",
      ],
      ["collapsed", "boolean", "false", "Icon-only rail."],
    ],
  },
  {
    slug: "combobox",
    name: "Combobox",
    description:
      "A searchable select for one or several values, with tags and async loading.",
    status: "beta",
    tall: true,
    useWhen: [
      "Choosing from a long or searchable list, or several values at once.",
    ],
    dontUseWhen: ["Fewer than about seven options. Use Select."],
    examples: [
      {
        title: "Multiple, open",
        html: `<div class="m-combobox" style="max-inline-size:20rem">
<div class="m-input m-combobox__box"><span class="m-badge m-combobox__tag" data-tone="accent">Belgium <button type="button" aria-label="Remove Belgium">×</button></span>
<input class="m-combobox__input" role="combobox" aria-label="Countries" aria-expanded="true" aria-controls="cb-list" aria-autocomplete="list" autocomplete="off" value="">
<button type="button" class="m-combobox__clear" aria-label="Clear">×</button></div>
<ul id="cb-list" role="listbox" aria-multiselectable="true" aria-label="Countries" class="m-combobox__list">
<li role="option" class="m-combobox__option" aria-selected="true">Belgium</li>
<li role="option" class="m-combobox__option" aria-selected="false" data-active>Germany</li>
<li role="option" class="m-combobox__option" aria-selected="false">Netherlands</li></ul></div>`,
        react: `<Combobox
  aria-label="Countries"
  multiple
  options={[{ value: "be", label: "Belgium" }, { value: "de", label: "Germany" }]}
  value={value}
  onValueChange={setValue}
  emptyLabel="No results"
  clearLabel="Clear"
  removeLabel={(label) => \`Remove \${label}\`}
/>`,
        svelte: `<Combobox aria-label="Countries" multiple {options} bind:value emptyLabel="No results" clearLabel="Clear" />`,
      },
    ],
    configurations: [
      {
        title: "Async",
        body: "Set `filter={false}`, load options in `onQueryChange` and pass `loading` with `loadingLabel`.",
      },
    ],
    accessibility: [
      "ARIA combobox pattern: focus stays in the input; the active option is `aria-activedescendant`.",
      "Tags have remove buttons with their own accessible names. Results and loading are announced through a status region.",
    ],
    keyboard: [
      ["↓ / ↑", "Open, or move the active option"],
      ["Enter", "Select the active option"],
      ["Esc", "Close"],
      ["Backspace", "Remove the last tag (multiple, empty input)"],
    ],
    props: [
      ["options", "ComboboxOption[]", "", "`value`, `label`, `disabled`."],
      ["multiple", "boolean", "false", "Several values shown as tags."],
      [
        "value / onValueChange",
        "string[]",
        "",
        "Selected values (at most one when single).",
      ],
      ["onQueryChange / filter / loading", "", "", "Async loading hooks."],
      [
        "emptyLabel, clearLabel, removeLabel",
        "string",
        "",
        "All text through props.",
      ],
    ],
  },
  {
    slug: "date-picker",
    name: "Date picker",
    description:
      "A date or date-time input, and a date range, on the native control.",
    status: "beta",
    useWhen: ["Entering a date, a date and time, or a period."],
    dontUseWhen: [
      "Birth dates far in the past. Use separate fields for day, month and year.",
    ],
    examples: [
      {
        title: "With calendar",
        html: calendarDemo(),
        react: `<DatePicker
  aria-label="Start date"
  min="2026-01-01"
  value={date}
  onValueChange={setDate}
  calendar={{
    openLabel: (field) => \`Choose \${field}\`,
    previousMonthLabel: "Previous month",
    nextMonthLabel: "Next month",
    todayLabel: "Today",
  }}
/>
<DateRangePicker legend="Period" startLabel="From" endLabel="To" value={range} onValueChange={setRange} calendar={calendar} />`,
        svelte: `<DatePicker aria-label="Start date" bind:value={date} calendar={calendar} />
<DateRangePicker legend="Period" startLabel="From" endLabel="To" bind:value={range} calendar={calendar} />`,
      },
    ],
    configurations: [
      {
        title: "Calendar and native input",
        body: "The input stays native, so typing, the locale-aware format and `min`/`max` keep working. Pass `calendar` (all labels as props) to add the Matter calendar popover; without it you get the plain native input. Month and weekday names follow `locale` (default: the browser). Values are ISO strings.",
      },
    ],
    accessibility: [
      "Every input needs a label; the range is a `fieldset` with a `legend`.",
      "`min` and `max` are enforced by the input and the calendar (disabled days); the end cannot precede the start.",
      "The calendar is a dialog with a day grid and roving focus; every day has its full date as accessible name.",
    ],
    keyboard: [
      ["Arrows", "Move one day or one week"],
      ["Home / End", "First / last day of the week"],
      ["PageUp / PageDown", "Previous / next month (with Shift: year)"],
      ["Enter / Space", "Choose the day"],
      ["Esc", "Close and return to the button"],
    ],
    props: [
      ["type", '"date" | "datetime-local"', "date", "Input type."],
      [
        "min / max",
        "string",
        "",
        "ISO bounds; days outside are disabled in the calendar.",
      ],
      [
        "calendar",
        "CalendarLabels",
        "",
        "`openLabel(field)`, `previousMonthLabel`, `nextMonthLabel`, `todayLabel`. Enables the popover.",
      ],
      [
        "locale / weekStart",
        "string / 0 | 1",
        "browser / 1",
        "Names and first day of the week.",
      ],
      [
        "DateRangePicker value",
        "{ start, end }",
        "",
        "ISO strings; `legend`, `startLabel`, `endLabel` required.",
      ],
    ],
  },
  {
    slug: "pagination",
    name: "Pagination",
    description: "Moves between pages of a long list.",
    status: "beta",
    useWhen: ["A list or table split into pages."],
    dontUseWhen: ["Short lists, or endless feeds."],
    examples: [
      {
        title: "Pages",
        html: `<nav class="m-pagination" aria-label="Pages"><ul>
<li><button class="m-button" type="button" disabled>Previous</button></li>
<li><button class="m-button" type="button" aria-label="Page 1">1</button></li>
<li><button class="m-button" type="button" aria-label="Page 4">4</button></li>
<li><button class="m-button" type="button" aria-label="Page 5" aria-current="page">5</button></li>
<li><button class="m-button" type="button" aria-label="Page 6">6</button></li>
<li><span class="m-pagination__gap" aria-hidden="true">…</span></li>
<li><button class="m-button" type="button" aria-label="Page 10">10</button></li>
<li><button class="m-button" type="button">Next</button></li></ul></nav>`,
        react: `<Pagination
  label="Pages"
  page={page}
  pageCount={10}
  onPageChange={setPage}
  previousLabel="Previous"
  nextLabel="Next"
  pageLabel={(n) => \`Page \${n}\`}
/>`,
        svelte: `<Pagination label="Pages" {page} pageCount={10} onPageChange={(n) => (page = n)} previousLabel="Previous" nextLabel="Next" pageLabel={(n) => \`Page \${n}\`} />`,
      },
    ],
    configurations: [
      {
        title: "Compact and page size",
        body: "`compact` shows only previous and next. Pass `pageSize`, `pageSizes`, `pageSizeLabel` and `onPageSizeChange` for a page-size selector.",
      },
    ],
    accessibility: [
      'A `nav` landmark; the current page has `aria-current="page"`.',
      "Page buttons get an accessible name from `pageLabel`.",
    ],
    props: [
      ["page / pageCount", "number", "", "Current page (1-based) and total."],
      [
        "onPageChange",
        "(page: number) => void",
        "",
        "Called with the new page.",
      ],
      [
        "previousLabel, nextLabel, pageLabel, label",
        "string / fn",
        "",
        "All text through props.",
      ],
      ["compact", "boolean", "false", "Previous and next only."],
    ],
  },
  {
    slug: "toast",
    name: "Toast",
    description: "A short message that appears, then goes away by itself.",
    status: "beta",
    useWhen: ["Confirming a background result such as saved or failed."],
    dontUseWhen: ["Errors the user must fix. Use a Banner or the field error."],
    examples: [
      {
        title: "Tones",
        html: `<div style="display:grid;gap:8px;max-inline-size:24rem">
<div class="m-toast" data-tone="success" role="status" style="animation:none"><div><div class="m-toast__title">Saved</div>Your changes are live.</div><button class="m-button" data-variant="ghost" data-icon-only type="button" aria-label="Dismiss"><span aria-hidden="true">×</span></button><button class="m-button" data-variant="ghost" data-size="sm" type="button">Undo</button></div>
<div class="m-toast" data-tone="danger" role="alert" style="animation:none"><div>Upload failed.</div><button class="m-button" data-variant="ghost" data-icon-only type="button" aria-label="Dismiss"><span aria-hidden="true">×</span></button></div></div>`,
        react: `<ToastRegion
  toasts={toasts}
  onDismiss={(id) => setToasts((all) => all.filter((t) => t.id !== id))}
  dismissLabel="Dismiss"
/>
// toasts: [{ id: "1", tone: "success", title: "Saved", message: "Your changes are live.", action: { label: "Undo", onAction } }]`,
        svelte: `<ToastRegion {toasts} onDismiss={(id) => (toasts = toasts.filter((t) => t.id !== id))} dismissLabel="Dismiss" />`,
      },
    ],
    configurations: [
      {
        title: "Duration",
        body: "Toasts dismiss after 5 seconds. Set `duration` per toast in milliseconds, or `0` to keep it until dismissed. The timer pauses on hover and focus.",
      },
    ],
    accessibility: [
      "`role=alert` for warning and danger, `role=status` otherwise.",
      "Never the only place for essential information. Animation is off under reduced motion.",
    ],
    props: [
      [
        "toasts",
        "ToastItem[]",
        "",
        "`id`, `tone`, `title`, `message`, `action`, `duration`. The app owns the list.",
      ],
      [
        "onDismiss",
        "(id: string) => void",
        "",
        "Called on dismiss, action and timeout.",
      ],
      [
        "dismissLabel",
        "string",
        "",
        "Accessible name of the dismiss button (required).",
      ],
    ],
  },
  {
    slug: "drawer",
    name: "Drawer",
    description:
      "A panel that slides in from the side without leaving the page.",
    status: "beta",
    useWhen: ["Creating or editing a related record while keeping context."],
    dontUseWhen: ["A short confirmation. Use Dialog."],
    examples: [
      {
        title: "Drawer",
        note: "Opens as a modal panel; shown here as static markup.",
        html: `<div class="m-drawer" style="position:static;display:flex;flex-direction:column;block-size:14rem;inline-size:100%;max-inline-size:24rem;box-shadow:none;border:1px solid var(--m-border)" role="group" aria-label="Edit page">
<div class="m-dialog__header"><h2 class="m-dialog__title">Edit page</h2><button class="m-button" data-variant="ghost" data-icon-only type="button" aria-label="Close"><span aria-hidden="true">×</span></button></div>
<div class="m-dialog__body">Form fields go here.</div></div>`,
        react: `<Drawer open={open} onOpenChange={setOpen} title="Edit page" closeLabel="Close" side="end" size="md" footer={<Button variant="primary">Save</Button>}>
  Form fields go here.
</Drawer>`,
        svelte: `<Drawer bind:open title="Edit page" closeLabel="Close" side="end" size="md">Form fields go here.</Drawer>`,
      },
    ],
    configurations: [
      {
        title: "Side and size",
        body: "`side` is `start` or `end` (default). `size` is `sm`, `md` or `lg`.",
      },
    ],
    accessibility: [
      "Native modal `<dialog>`: focus trap, Esc closes, background is inert, focus returns to the trigger.",
      "`title` is the accessible name.",
    ],
    props: [
      ["open / onOpenChange", "boolean", "", "Controlled open state."],
      ["title, closeLabel", "string", "", "Required."],
      ["side", '"start" | "end"', "end", "Edge the panel slides from."],
      ["size", '"sm" | "md" | "lg"', "md", "Width."],
      ["footer", "node", "", "Action area."],
    ],
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    description: "Shows where the current page sits in the hierarchy.",
    status: "beta",
    useWhen: ["Deep hierarchies where users need a way back up."],
    dontUseWhen: ["Flat sites with one or two levels."],
    examples: [
      {
        title: "Trail",
        html: `<nav class="m-breadcrumb" aria-label="Breadcrumb"><ol>
<li><a href="#">Home</a></li><li><a href="#">Collections</a></li><li><span aria-current="page">Pages</span></li></ol></nav>`,
        react: `<Breadcrumb label="Breadcrumb" items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/c" }, { label: "Pages" }]} />`,
        svelte: `<Breadcrumb label="Breadcrumb" items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/c" }, { label: "Pages" }]} />`,
      },
    ],
    configurations: [
      {
        title: "Overflow",
        body: "With `maxItems`, middle items collapse behind a button named by `expandLabel`.",
      },
    ],
    accessibility: [
      'A `nav` landmark with an ordered list; the last item has `aria-current="page"`.',
      "The separator is CSS, so screen readers do not hear it.",
    ],
    props: [
      ["label", "string", "", "Accessible name (required)."],
      [
        "items",
        "BreadcrumbItem[]",
        "",
        "`label` and `href`; the last item has no `href`.",
      ],
      ["maxItems / expandLabel", "number / string", "", "Collapse the middle."],
    ],
  },
  {
    slug: "file-upload",
    name: "File upload",
    description: "Choose or drop files, with progress and per-file errors.",
    status: "beta",
    useWhen: ["Uploading images or documents."],
    dontUseWhen: ["Importing data that needs a guided flow."],
    examples: [
      {
        title: "With files",
        html: `<div class="m-dropzone" style="max-inline-size:28rem"><label class="m-dropzone__area"><input class="m-dropzone__input" type="file" multiple aria-describedby="fu-hint"><span>Drop files or choose</span><span id="fu-hint">PNG or JPG, up to 5 MB</span></label>
<ul><li class="m-dropzone__file"><span></span><span>cover.png</span><div class="m-progress" role="progressbar" aria-label="cover.png" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" style="--m-progress:40%"><div class="m-progress__bar"></div></div></li>
<li class="m-dropzone__file"><span></span><span>logo.png</span><p class="m-field__error">File is larger than 5 MB</p></li></ul></div>`,
        react: `<FileUpload label="Drop files or choose" hint="PNG or JPG, up to 5 MB" accept="image/*" multiple files={files} onFilesAdded={add} onRemove={remove} removeLabel={(name) => \`Remove \${name}\`} />`,
        svelte: `<FileUpload label="Drop files or choose" hint="PNG or JPG, up to 5 MB" accept="image/*" multiple {files} onFilesAdded={add} onRemove={remove} />`,
      },
    ],
    configurations: [
      {
        title: "Validation",
        body: "`accept` only filters the file picker. Check type and size in your code and on the server, then set `error` on the file.",
      },
    ],
    accessibility: [
      "A native file input inside a label: click, keyboard and screen readers work; drag and drop is extra.",
      "Progress uses ProgressBar with the file name as its label.",
    ],
    props: [
      ["label, hint", "string", "", "Text in the drop area (required: label)."],
      [
        "accept, multiple, disabled",
        "",
        "",
        "Passed to the input. Single mode keeps the first file.",
      ],
      [
        "files",
        "UploadFile[]",
        "",
        "`id`, `name`, `progress`, `error`, `previewUrl`.",
      ],
      [
        "onFilesAdded / onRemove",
        "fn",
        "",
        "Chosen or dropped files; remove by id.",
      ],
    ],
  },
  {
    slug: "split-button",
    name: "Split button",
    description:
      "A main action with a menu of related actions, in one control.",
    status: "beta",
    tall: true,
    useWhen: [
      "One action is the default and a few variants sit behind it, such as Publish changes with Save draft and Unpublish.",
    ],
    dontUseWhen: [
      "Two equal actions. Use two Buttons or a Button group.",
      "Only secondary actions. Use Menu.",
    ],
    examples: [
      {
        title: "Variants and disabled",
        html: `<div class="m-split" data-variant="primary"><button class="m-button m-split__main" data-variant="primary" type="button">Publish changes</button><button class="m-button m-split__trigger" data-variant="primary" type="button" aria-label="More publish options" aria-haspopup="menu" aria-expanded="false">${icon('<path d="m6 9 6 6 6-6"/>')}</button></div>
<div class="m-split" data-variant="secondary"><button class="m-button m-split__main" data-variant="secondary" type="button">Save</button><button class="m-button m-split__trigger" data-variant="secondary" type="button" aria-label="More save options" aria-haspopup="menu" aria-expanded="false">${icon('<path d="m6 9 6 6 6-6"/>')}</button></div>
<div class="m-split" data-variant="primary"><button class="m-button m-split__main" data-variant="primary" type="button" disabled>Publish changes</button><button class="m-button m-split__trigger" data-variant="primary" type="button" aria-label="More options" aria-haspopup="menu" disabled>${icon('<path d="m6 9 6 6 6-6"/>')}</button></div>`,
        react: `<SplitButton
  variant="primary"
  onClick={publish}
  onSelect={(id) => run(id)}
  menuLabel="More publish options"
  items={[
    { id: "draft", label: "Save draft" },
    { id: "unpublish", label: "Unpublish" },
  ]}
>
  Publish changes
</SplitButton>`,
        svelte: `<SplitButton variant="primary" onClick={publish} onSelect={(id) => run(id)} menuLabel="More publish options" items={items}>
  Publish changes
</SplitButton>`,
      },
    ],
    configurations: [
      {
        title: "Disabled",
        body: "`disabled` disables both parts with the same colours. `mainDisabled` and `menuDisabled` disable one part.",
      },
    ],
    accessibility: [
      'The trigger has its own accessible name (`menuLabel`), `aria-haspopup="menu"` and `aria-expanded`.',
      "Esc closes the menu and returns focus to the trigger.",
    ],
    keyboard: [
      ["Tab", "Main action, then the menu trigger"],
      ["↓ / ↑", "On the trigger: open the menu"],
      ["↓ / ↑ / Home / End", "Move between items"],
      ["Enter / Space", "Choose"],
      ["Esc", "Close"],
    ],
    props: [
      ["children", "node", "", "Text of the main action."],
      ["onClick", "() => void", "", "Main action."],
      [
        "items / onSelect",
        "MenuItem[]",
        "",
        "`id`, `label`, `disabled`; called with the chosen id.",
      ],
      ["menuLabel", "string", "", "Accessible name of the trigger (required)."],
      [
        "variant",
        '"primary" | "secondary"',
        "secondary",
        "Both parts share it.",
      ],
      ["size", '"sm" | "md" | "lg"', "md", "Follows density."],
      [
        "disabled / mainDisabled / menuDisabled",
        "boolean",
        "false",
        "Whole or per part.",
      ],
    ],
  },
  {
    slug: "button-group",
    name: "Button group",
    description: "Joins related buttons into one segmented control.",
    status: "beta",
    useWhen: [
      "Switching between a few related options or views, such as List and Grid.",
    ],
    dontUseWhen: ["Unrelated actions. Space them apart as separate Buttons."],
    examples: [
      {
        title: "Segmented",
        html: `<div class="m-button-group" role="group" aria-label="View"><button class="m-button" type="button" aria-pressed="true">List</button><button class="m-button" type="button" aria-pressed="false">Grid</button><button class="m-button" type="button" aria-pressed="false">Board</button></div>`,
        react: `<ButtonGroup label="View">
  <Button aria-pressed={view === "list"} onClick={() => setView("list")}>List</Button>
  <Button aria-pressed={view === "grid"} onClick={() => setView("grid")}>Grid</Button>
</ButtonGroup>`,
        svelte: `<ButtonGroup label="View">
  <Button aria-pressed={view === "list"} onclick={() => (view = "list")}>List</Button>
  <Button aria-pressed={view === "grid"} onclick={() => (view = "grid")}>Grid</Button>
</ButtonGroup>`,
      },
    ],
    configurations: [
      {
        title: "Toggles",
        body: "Show the selected option with `aria-pressed`. The group has no behaviour of its own.",
      },
    ],
    accessibility: [
      "`role=group` named by `label`; each button keeps its own name and state.",
    ],
    props: [
      ["label", "string", "", "Accessible name of the group (required)."],
    ],
  },
  {
    slug: "rich-text-editor",
    name: "Rich text editor",
    description:
      "Surface, toolbar and typography for rich text. Bring your own editor engine.",
    status: "beta",
    useWhen: [
      "Wrapping Lexical, Tiptap, ProseMirror or a plain contenteditable so it looks like the other fields.",
      "Showing stored rich text with Matter typography (Prose), without an editor.",
    ],
    dontUseWhen: [
      "Plain multi-line input. Use Textarea.",
      "You need an editor engine. Matter ships the look and the toolbar building blocks, not document state, commands or serialisation.",
    ],
    examples: [
      {
        title: "Editor (live demo)",
        html: editorDemo(),
        react: `import { bold, italic, listOrdered, list, undo, redo } from "@interstellarforge/matter-icons";

<EditorFrame
  invalid={Boolean(error)}
  disabled={disabled}
  toolbar={
    <Toolbar label="Formatting">
      <Select aria-label="Text style" value={block} onChange={setBlock}>
        <option value="p">Paragraph</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </Select>
      <ButtonGroup label="Text">
        <IconButton label="Bold" size="sm" aria-pressed={isBold} onClick={toggleBold}>
          <Icon icon={bold} />
        </IconButton>
        <IconButton label="Italic" size="sm" aria-pressed={isItalic} onClick={toggleItalic}>
          <Icon icon={italic} />
        </IconButton>
      </ButtonGroup>
      <IconButton label="Undo" size="sm" onClick={undo} disabled={!canUndo}>
        <Icon icon={undoIcon} />
      </IconButton>
    </Toolbar>
  }
>
  {/* Your engine's editable element. */}
  <YourEditable
    className="m-editor__content m-prose"
    role="textbox"
    aria-multiline="true"
    aria-label="Body"
    data-empty={isEmpty ? "" : undefined}
    data-placeholder="Write something"
  />
</EditorFrame>`,
        svelte: `<EditorFrame invalid={Boolean(error)} {disabled}>
  {#snippet toolbar()}
    <Toolbar label="Formatting">
      <ButtonGroup label="Text">
        <IconButton label="Bold" size="sm" aria-pressed={isBold} onclick={toggleBold}>
          <Icon icon={bold} />
        </IconButton>
        <IconButton label="Italic" size="sm" aria-pressed={isItalic} onclick={toggleItalic}>
          <Icon icon={italic} />
        </IconButton>
      </ButtonGroup>
    </Toolbar>
  {/snippet}
  <YourEditable
    class="m-editor__content m-prose"
    role="textbox"
    aria-multiline="true"
    aria-label="Body"
    data-empty={isEmpty ? "" : undefined}
    data-placeholder="Write something"
  />
</EditorFrame>`,
      },
      {
        title: "Invalid and disabled",
        html: `<div style="display:grid;gap:var(--m-space-3)"><div class="m-editor" data-invalid><div class="m-editor__content m-prose" role="textbox" aria-multiline="true" aria-label="Description" aria-invalid="true">Too short.</div></div><div class="m-editor" data-disabled><div class="m-editor__content m-prose" role="textbox" aria-multiline="true" aria-label="Notes" aria-disabled="true">Read-only content.</div></div></div>`,
        react: `<EditorFrame invalid>...</EditorFrame>
<EditorFrame disabled>...</EditorFrame>`,
        svelte: `<EditorFrame invalid>...</EditorFrame>
<EditorFrame disabled>...</EditorFrame>`,
      },
      {
        title: "Prose (display only)",
        html: `<div class="m-prose"><h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4><p>Body text with a <a href="#">link</a>, <strong>bold</strong>, <em>italic</em> and <code>inline code</code>.</p><ul><li>Bullet one</li><li>Bullet two</li></ul><ol><li>First</li><li>Second</li></ol><blockquote>A quotation.</blockquote><pre><code>const matter = true;</code></pre></div>`,
        react: `<Prose dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />`,
        svelte: `<Prose>{@html sanitizedHtml}</Prose>`,
      },
    ],
    configurations: [
      {
        title: "What Matter does and does not do",
        body: "Matter provides `EditorFrame` (the surface), `Toolbar` (role, keyboard, layout) and `Prose` (typography). Your engine owns the document, the commands and the active-format state; you pass that state in as `aria-pressed`, `disabled` and `invalid`.",
      },
      {
        title: "Placeholder and empty state",
        body: "Set `data-empty` and `data-placeholder` on the editable element (`.m-editor__content`) while the document is empty, and remove `data-empty` as soon as it has content. Matter draws the placeholder with CSS; it never touches the content.",
      },
      {
        title: "Typography inside the editor",
        body: "Add `m-prose` next to `m-editor__content` so what people type looks the same as what you later render with `Prose`.",
      },
      {
        title: "Toolbar contents",
        body: "Use `IconButton` (size `sm`) for commands, `ButtonGroup` to group related toggles, a `Select` for text style and a `Menu` for overflow. Toggle commands (bold, italic, lists) are buttons with `aria-pressed`; one-shot commands (undo, redo) are plain buttons that become `disabled` when unavailable.",
      },
      {
        title: "Wiring an engine",
        body: "Lexical: render `ContentEditable` with the `m-editor__content` class and read format state in an update listener. Tiptap: pass `editorProps.attributes.class` and drive `aria-pressed` from `editor.isActive()`. Plain `contenteditable`: see the live demo, which uses `document.execCommand` only to keep the demo small.",
      },
      {
        title: "States",
        body: "Focus is drawn on the whole frame (`:focus-within`), so the toolbar and editor read as one field. `invalid` turns the border to the danger colour; pair it with an error message via `FormField`. `disabled` blocks pointer input on the content.",
      },
      {
        title: "Theme, colour mode and density",
        body: "Everything uses semantic tokens, so light, dark and the density profiles apply automatically. Switch them in the header to try.",
      },
    ],
    accessibility: [
      "`role=toolbar` named by `label`. One tab stop for the buttons; `←` `→` move (wrapping), `Home` and `End` jump to the ends. A `Select` in the toolbar keeps its own tab stop so its arrow keys keep working.",
      "Toggle buttons expose state with `aria-pressed`. Icon-only buttons need a `label`.",
      "The editable element is a named multiline `textbox`; mark it `aria-invalid` when invalid.",
      "Keep the placeholder as a hint only: give the editor a real label via `aria-label` or `FormField`.",
    ],
    props: [
      ["Toolbar label", "string", "", "Accessible name (required)."],
      ["EditorFrame toolbar", "node | snippet", "", "Usually a `Toolbar`."],
      [
        "EditorFrame invalid / disabled",
        "boolean",
        "false",
        "Border and background states.",
      ],
      ["Prose", "node", "", "Wrapper that styles rich text content."],
    ],
  },
  {
    slug: "icon",
    name: "Icon",
    description:
      "One of 60 stroke icons, drawn on a 24px grid in the current text colour.",
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
  {
    slug: "score-ring",
    name: "ScoreRing",
    description:
      "Shows a percentage as an arc around its value, for scores such as a match.",
    status: "stable",
    useWhen: ["A single score from 0 to 100 next to a title or in a list row."],
    dontUseWhen: [
      "Progress of a task. Use a ProgressBar.",
      "Several values at once. Use a BarChart.",
    ],
    examples: [
      {
        title: "Sizes and tones",
        html: `<div class="m-score-ring" role="meter" aria-label="Match" aria-valuemin="0" aria-valuemax="100" aria-valuenow="94" aria-valuetext="94%" data-size="md" data-tone="success" style="--m-score:94"><svg class="m-score-ring__svg" viewBox="0 0 36 36" aria-hidden="true" focusable="false"><circle class="m-score-ring__track" cx="18" cy="18" r="16"/><circle class="m-score-ring__arc" cx="18" cy="18" r="16" pathLength="100"/></svg><span class="m-score-ring__text" aria-hidden="true">94%</span></div>
<div class="m-score-ring" role="meter" aria-label="Match" aria-valuemin="0" aria-valuemax="100" aria-valuenow="62" aria-valuetext="62%" data-size="lg" data-tone="warning" style="--m-score:62"><svg class="m-score-ring__svg" viewBox="0 0 36 36" aria-hidden="true" focusable="false"><circle class="m-score-ring__track" cx="18" cy="18" r="16"/><circle class="m-score-ring__arc" cx="18" cy="18" r="16" pathLength="100"/></svg><span class="m-score-ring__text" aria-hidden="true">62%</span></div>
<div class="m-score-ring" role="meter" aria-label="Match" aria-valuemin="0" aria-valuemax="100" aria-valuenow="30" aria-valuetext="30%" data-size="sm" data-tone="danger" style="--m-score:30"><svg class="m-score-ring__svg" viewBox="0 0 36 36" aria-hidden="true" focusable="false"><circle class="m-score-ring__track" cx="18" cy="18" r="16"/><circle class="m-score-ring__arc" cx="18" cy="18" r="16" pathLength="100"/></svg><span class="m-score-ring__text" aria-hidden="true">30%</span></div>`,
        react: `<ScoreRing label="Match" value={94} tone="success" />
<ScoreRing label="Match" value={62} tone="warning" size="lg" />
<ScoreRing label="Match" value={30} tone="danger" size="sm" />`,
        svelte: `<ScoreRing label="Match" value={94} tone="success" />
<ScoreRing label="Match" value={62} tone="warning" size="lg" />
<ScoreRing label="Match" value={30} tone="danger" size="sm" />`,
      },
    ],
    configurations: [
      {
        title: "Tone",
        body: "`tone` colours the arc only; the number stays in the text colour for contrast. Pick the tone from the value in your app (for example success from 85).",
      },
      {
        title: "Centre text",
        body: "By default the centre shows the rounded percentage. Pass children to replace it; set `valueText` so the spoken value matches.",
      },
    ],
    accessibility: [
      "`role=meter` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-valuetext` (default: the rounded percentage). The `label` is required.",
      "The tone is never the only signal: the value is always text.",
    ],
    props: [
      ["label", "string", "", "Accessible name (required)."],
      ["value", "number", "", "Current value (required)."],
      ["max", "number", "100", "Value that fills the ring."],
      ["size", '"sm" | "md" | "lg"', '"md"', "Diameter."],
      [
        "tone",
        '"accent" | "info" | "success" | "warning" | "danger"',
        '"accent"',
        "Arc colour.",
      ],
      ["valueText", "string", "rounded %", "Spoken value."],
    ],
  },
  {
    slug: "bar-chart",
    name: "BarChart",
    description:
      "One bar per category, for comparing a handful of values such as counts per day.",
    status: "stable",
    useWhen: ["Comparing 3 to about 14 values in one series."],
    dontUseWhen: [
      "Many series, axes, zooming or exact reading. Use a charting library.",
    ],
    examples: [
      {
        title: "Per weekday",
        html: `<div class="m-barchart" role="group" aria-label="New vacancies per day"><ul class="m-barchart__bars" role="list">${[
          ["Mon", 6],
          ["Tue", 11],
          ["Wed", 8],
          ["Thu", 14],
          ["Fri", 10],
          ["Sat", 18],
          ["Sun", 12],
        ]
          .map(
            ([label, value]) =>
              `<li class="m-barchart__bar" style="--m-bar:${String(Math.round((Number(value) / 18) * 100))}%"><span class="m-barchart__track" aria-hidden="true"><span class="m-barchart__value">${String(value)}</span><span class="m-barchart__fill"></span></span><span class="m-barchart__label" aria-hidden="true">${String(label)}</span><span class="m-sr-only">${String(label)}: ${String(value)}</span></li>`,
          )
          .join("")}</ul></div>`,
        react: `<BarChart
  label="New vacancies per day"
  data={[
    { label: "Mon", value: 6 },
    { label: "Tue", value: 11 },
    { label: "Sat", value: 18, valueLabel: "18 vacancies" },
  ]}
/>`,
        svelte: `<BarChart
  label="New vacancies per day"
  data={[
    { label: "Mon", value: 6 },
    { label: "Tue", value: 11 },
    { label: "Sat", value: 18, valueLabel: "18 vacancies" },
  ]}
/>`,
      },
    ],
    configurations: [
      {
        title: "Height",
        body: "The chart is 9rem high; set `--m-chart-h` on it to change that. Bars are relative to the largest value unless you pass `max`.",
      },
      {
        title: "Values",
        body: "The value appears above a bar on hover. `valueLabel` replaces the number in that label and in the spoken text.",
      },
    ],
    accessibility: [
      "A group named by `label` holding a list; each bar is one item read as `label: value`, so the chart is usable without seeing it.",
      "Add a caption or heading next to the chart that says what it measures; the group name should match it.",
    ],
    props: [
      ["label", "string", "", "Accessible name (required)."],
      [
        "data",
        "{ id?, label, value, valueLabel? }[]",
        "",
        "One entry per bar.",
      ],
      ["max", "number", "largest value", "Value that fills the height."],
    ],
  },
  {
    slug: "stat-card",
    name: "StatCard",
    description:
      "A Card for one key figure: a label, a value, an optional icon, a trend and supporting text.",
    status: "stable",
    useWhen: ["Dashboard figures and summaries at the top of a page."],
    dontUseWhen: [
      "Tabular data. Use a DataTable.",
      "A clickable tile. Put a link or button inside.",
    ],
    examples: [
      {
        title: "With icon, trend and description",
        html: `<div class="m-card m-stat" style="max-inline-size:20rem"><div class="m-stat__head"><p class="m-stat__label">Active vacancies</p><span class="m-stat__icon" aria-hidden="true">${icon('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>')}</span></div><div class="m-stat__body"><p class="m-stat__value">284</p><span class="m-badge" data-tone="success">+18 this week</span></div><p class="m-stat__text">From 4 connected sources</p></div>`,
        react: `<StatCard
  label="Active vacancies"
  value="284"
  icon={<Icon icon={briefcase} />}
  aside={<Badge tone="success">+18 this week</Badge>}
  description="From 4 connected sources"
/>`,
        svelte: `<StatCard label="Active vacancies" value="284" description="From 4 connected sources">
  {#snippet icon()}<Icon icon={briefcase} />{/snippet}
  {#snippet aside()}<Badge tone="success">+18 this week</Badge>{/snippet}
</StatCard>`,
      },
    ],
    configurations: [
      {
        title: "Composition",
        body: "StatCard is a Card (`m-card`) with fixed slots. It has no behaviour; format the value in your app (locale, units).",
      },
    ],
    accessibility: [
      "Plain paragraphs in reading order: label, value, trend, description. The icon is decorative.",
      "Trend colour comes from a Badge, which must also carry text.",
    ],
    props: [
      ["label", "string", "", "What the value measures (required)."],
      ["value", "string", "", "The figure (required)."],
      ["icon", "node / snippet", "", "Decorative icon."],
      ["aside", "node / snippet", "", "Trend or Badge next to the value."],
      ["description", "string", "", "Supporting text."],
    ],
  },
  {
    slug: "sortable-list",
    name: "SortableList",
    description:
      "A list whose items the user can reorder by dragging a grip or with the keyboard.",
    status: "stable",
    useWhen: ["Letting people set the order of sections, steps or priorities."],
    dontUseWhen: [
      "Moving items between lists. Use a KanbanBoard.",
      "Sorting by a column. Use a DataTable.",
    ],
    examples: [
      {
        title: "Sections",
        note: "Try it: drag an item, or focus its grip and use the arrow keys.",
        html: `<ul class="m-sortable" aria-label="Sections" style="max-inline-size:22rem">${[
          "Personal details",
          "Profile",
          "Experience",
        ]
          .map(
            (name) =>
              `<li class="m-sortable__item"><button type="button" class="m-sortable__grip" aria-label="Move ${name}">${icon('<path d="M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01"/>')}</button><div class="m-sortable__content">${name}</div></li>`,
          )
          .join("")}</ul>`,
        react: `const [sections, setSections] = useState(initial);

<SortableList
  label="Sections"
  items={sections}
  renderItem={(item) => item.title}
  gripLabel={(item) => \`Move \${item.title}\`}
  announceMove={(item, n, total) => \`\${item.title}, \${n} of \${total}\`}
  onReorder={({ ids }) =>
    setSections(ids.map((id) => sections.find((s) => s.id === id)!))
  }
/>`,
        svelte: `<SortableList
  label="Sections"
  items={sections}
  gripLabel={(item) => \`Move \${item.title}\`}
  announceMove={(item, n, total) => \`\${item.title}, \${n} of \${total}\`}
  onReorder={({ ids }) => (sections = ids.map((id) => sections.find((s) => s.id === id)!))}
>
  {#snippet item(section)}{section.title}{/snippet}
</SortableList>`,
      },
    ],
    configurations: [
      {
        title: "Controlled order",
        body: "The app owns the order. `onReorder` gives the moved id, its old and new index and all ids in the new order; while dragging, a floating copy follows the pointer and a placeholder marks where it will land; the order is committed on release. Mouse and pen drag the whole item, touch drags by the grip.",
      },
    ],
    accessibility: [
      "Every item has a grip button named by `gripLabel`. Moving by keyboard needs no pointer.",
      "After a move a polite live region speaks `announceMove`.",
    ],
    keyboard: [
      ["↑ / ↓", "Move the focused item one place up or down."],
      ["Home / End", "Move the item to the start or the end."],
    ],
    props: [
      ["label", "string", "", "Accessible name of the list (required)."],
      ["items", "{ id }[]", "", "Items in the current order."],
      ["renderItem / item", "function / snippet", "", "Content of one item."],
      [
        "onReorder",
        "({ id, from, to, ids }) => void",
        "",
        "Called after a move.",
      ],
      ["gripLabel", "(item) => string", "", "Accessible name of a grip."],
      [
        "announceMove",
        "(item, position, total) => string",
        "",
        "Spoken after a move.",
      ],
    ],
  },
  {
    slug: "kanban-board",
    name: "KanbanBoard",
    description:
      "Columns of cards that can be dragged between columns or moved with the keyboard.",
    status: "stable",
    useWhen: ["Items that move through stages: pipelines, boards, statuses."],
    dontUseWhen: [
      "A single reorderable list. Use a SortableList.",
      "Rules about which moves are allowed. Check them in `onMove` and leave `columns` unchanged to refuse.",
    ],
    examples: [
      {
        title: "Pipeline",
        note: "Try it: drag a card between columns, or focus its grip and use the arrow keys.",
        html: `<div class="m-kanban" role="group" aria-label="Pipeline" data-empty="No cards">${[
          ["Saved", "info", ["Project manager", "Functional administrator"]],
          ["Preparing", "warning", ["Product owner"]],
          ["Applied", "success", []],
        ]
          .map(
            ([title, tone, cards]) =>
              `<section class="m-kanban__column" aria-label="${String(title)}" data-tone="${String(tone)}"><h3 class="m-kanban__header"><span>${String(title)}</span><span class="m-badge" data-tone="neutral">${String((cards as string[]).length)}</span></h3><ul class="m-kanban__list" role="list">${(
                cards as string[]
              )
                .map(
                  (card) =>
                    `<li class="m-kanban__card"><button type="button" class="m-kanban__grip" aria-label="Move ${card}">${icon('<path d="M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01"/>')}</button><div class="m-kanban__content">${card}</div></li>`,
                )
                .join("")}</ul></section>`,
          )
          .join("")}</div>`,
        react: `<KanbanBoard
  label="Applications"
  columns={columns}
  renderCard={(item) => item.title}
  emptyLabel="No cards"
  renderFooter={(column) => <Button variant="ghost">Add</Button>}
  gripLabel={(item) => \`Move \${item.title}\`}
  announceMove={(item, column, n, total) => \`\${item.title} to \${column.title}, \${n} of \${total}\`}
  onMove={(move) => setColumns((current) => applyMove(current, move))}
/>`,
        svelte: `<KanbanBoard
  label="Applications"
  {columns}
  emptyLabel="No cards"
  gripLabel={(item) => \`Move \${item.title}\`}
  announceMove={(item, column, n, total) => \`\${item.title} to \${column.title}, \${n} of \${total}\`}
  onMove={(move) => (columns = applyMove(columns, move))}
>
  {#snippet card(item)}{item.title}{/snippet}
  {#snippet footer(column)}<Button variant="ghost">Add</Button>{/snippet}
</KanbanBoard>`,
      },
    ],
    configurations: [
      {
        title: "Controlled data",
        body: "The app owns `columns`. `onMove` gives the id, source and target column and the index in the target once the card has left its old place (like `splice`). While dragging, the board shows a placeholder and a floating copy of the card; it commits on release.",
      },
      {
        title: "Mouse, touch and keyboard",
        body: "Mouse and pen drag the whole card (buttons and links inside keep working). Touch drags by the grip, which stays visible on touch screens. The grip is hidden visually on other devices until it has focus.",
      },
    ],
    accessibility: [
      "The board is a group; each column is a section named by its title, with a card count.",
      "Every card has a grip button named by `gripLabel`; focus returns to it after a move. A polite live region speaks `announceMove`.",
    ],
    keyboard: [
      ["↑ / ↓", "Move the focused card up or down in its column."],
      [
        "← / →",
        "Move the card to the previous or next column, at the same position if possible.",
      ],
    ],
    props: [
      ["label", "string", "", "Accessible name of the board (required)."],
      [
        "columns",
        "{ id, title, tone?, items }[]",
        "",
        "Columns with their cards (`id` required on each card).",
      ],
      ["renderCard / card", "function / snippet", "", "Content of one card."],
      ["emptyLabel", "string", "", "Shown in a column without cards."],
      [
        "renderFooter / footer",
        "function / snippet",
        "",
        "Below a column's cards.",
      ],
      [
        "onMove",
        "({ id, fromColumn, toColumn, index }) => void",
        "",
        "Called after a move.",
      ],
      ["gripLabel", "(item) => string", "", "Accessible name of a grip."],
      [
        "announceMove",
        "(item, column, position, total) => string",
        "",
        "Spoken after a move.",
      ],
    ],
  },
  {
    slug: "color-swatches",
    name: "ColorSwatches",
    description: "A row of colour chips of which one can be chosen.",
    status: "stable",
    useWhen: ["Picking one colour from a short, fixed set (an accent colour)."],
    dontUseWhen: ["Any colour. Use `input type=color` or a full picker."],
    examples: [
      {
        title: "Accent colour",
        html: `<div class="m-swatches" role="radiogroup" aria-label="Accent colour">${[
          ["Blue", "#2f6fbd", true],
          ["Teal", "#2a8c86", false],
          ["Violet", "#6c6fc0", false],
          ["Slate", "#4a5568", false],
          ["Copper", "#c0805e", false],
        ]
          .map(
            ([name, color, on]) =>
              `<label class="m-swatch" title="${String(name)}"><input type="radio" name="swatch-demo" value="${String(name).toLowerCase()}" aria-label="${String(name)}"${on ? " checked" : ""}><span class="m-swatch__chip" style="--m-swatch:${String(color)}"></span></label>`,
          )
          .join("")}</div>`,
        react: `<ColorSwatches
  label="Accent colour"
  options={[
    { value: "blue", label: "Blue", color: "#2f6fbd" },
    { value: "teal", label: "Teal", color: "#2a8c86" },
  ]}
  value={accent}
  onValueChange={setAccent}
/>`,
        svelte: `<ColorSwatches
  label="Accent colour"
  options={[
    { value: "blue", label: "Blue", color: "#2f6fbd" },
    { value: "teal", label: "Teal", color: "#2a8c86" },
  ]}
  bind:value={accent}
/>`,
      },
    ],
    configurations: [
      {
        title: "Colours are data",
        body: "`color` is any CSS colour from your app (for example a document theme). Matter styles the frame and selection ring only; the selection ring uses the text colour so it shows on any chip.",
      },
    ],
    accessibility: [
      "Native radio inputs in a `radiogroup`; each has the colour name as its accessible name, so the colour is never the only information.",
      "The selected chip has a ring, not only a different colour.",
    ],
    keyboard: [
      ["Tab", "Enter and leave the group (one tab stop)."],
      ["← → ↑ ↓", "Move to and select the previous or next colour."],
    ],
    props: [
      ["label", "string", "", "Accessible name of the group (required)."],
      ["options", "{ value, label, color }[]", "", "The choices."],
      [
        "value / defaultValue",
        "string",
        "",
        "Selected value (React: both; Svelte: `bind:value`).",
      ],
      ["onValueChange", "(value) => void", "", "Called on selection."],
      ["name", "string", "generated", "Form field name."],
      ["disabled", "boolean", "false", "Disables all chips."],
    ],
  },
  {
    slug: "slider",
    name: "Slider",
    description:
      "Picks a number from a range by dragging, with a filled track.",
    status: "stable",
    useWhen: [
      "A value within a known range where the exact number matters less than the position.",
    ],
    dontUseWhen: ["An exact value. Use a NumberStepper or an Input."],
    examples: [
      {
        title: "Line spacing",
        html: `<div style="max-inline-size:20rem"><input class="m-slider" type="range" min="0" max="100" value="40" aria-label="Line spacing" style="--m-slider-fill:40%"></div>`,
        react: `<Slider aria-label="Line spacing" value={spacing} onValueChange={setSpacing} />`,
        svelte: `<Slider aria-label="Line spacing" bind:value={spacing} />`,
      },
    ],
    configurations: [
      {
        title: "Native input",
        body: "A `type=range` input: `min`, `max`, `step`, `disabled` and `name` work as usual, and so do forms. The filled part is drawn from the value.",
      },
    ],
    accessibility: [
      "Needs an accessible name (`aria-label`, `aria-labelledby` or a FormField label).",
      '`valueText` sets `aria-valuetext` when the bare number is unclear, for example "1.5 lines".',
    ],
    keyboard: [
      ["← → ↑ ↓", "Change by one step."],
      ["Home / End", "Minimum and maximum."],
      ["PageUp / PageDown", "Larger steps (browser default)."],
    ],
    props: [
      [
        "value / defaultValue",
        "number",
        "min",
        "Current value (React: both; Svelte: `bind:value`).",
      ],
      ["onValueChange", "(value) => void", "", "Called while dragging."],
      ["min, max, step", "number", "0, 100, 1", "Range."],
      ["valueText", "(value) => string", "", "Spoken value."],
    ],
  },
  {
    slug: "number-stepper",
    name: "NumberStepper",
    description:
      "A number input with minus and plus buttons and an optional unit.",
    status: "stable",
    useWhen: ["Small adjustments to a number: font size, zoom, quantity."],
    dontUseWhen: ["Large ranges where position matters. Use a Slider."],
    examples: [
      {
        title: "Font size",
        html: `<div class="m-stepper" style="max-inline-size:14rem"><button type="button" class="m-button" data-icon-only aria-label="Smaller">${icon('<path d="M5 12h14"/>')}</button><span class="m-stepper__field"><input class="m-stepper__input" type="number" inputmode="decimal" min="8" max="14" step="0.5" value="10.5" aria-label="Font size" aria-valuetext="10.5 pt"><span class="m-stepper__unit" aria-hidden="true">pt</span></span><button type="button" class="m-button" data-icon-only aria-label="Larger">${icon('<path d="M12 5v14M5 12h14"/>')}</button></div>`,
        react: `<NumberStepper
  aria-label="Font size"
  value={size}
  onValueChange={setSize}
  min={8}
  max={14}
  step={0.5}
  unit="pt"
  decrementLabel="Smaller"
  incrementLabel="Larger"
/>`,
        svelte: `<NumberStepper
  aria-label="Font size"
  bind:value={size}
  min={8}
  max={14}
  step={0.5}
  unit="pt"
  decrementLabel="Smaller"
  incrementLabel="Larger"
/>`,
      },
    ],
    configurations: [
      {
        title: "Limits and precision",
        body: "Values are clamped to `min` and `max` and rounded to the precision of `step`, so 10 + 0.5 is 10.5, never 10.500000001. A button is disabled at its limit. Typing is free until the field loses focus.",
      },
    ],
    accessibility: [
      "A native `type=number` input (role spinbutton) named by `aria-label`; the buttons are named by `decrementLabel` and `incrementLabel`.",
      "With `unit` the spoken value is the number plus the unit.",
    ],
    keyboard: [
      ["↑ / ↓", "In the input: native step up or down."],
      ["Tab, Enter / Space", "The buttons are normal buttons."],
    ],
    props: [
      [
        "value / defaultValue",
        "number",
        "",
        "Current value (React: both; Svelte: `bind:value`).",
      ],
      [
        "onValueChange",
        "(value) => void",
        "",
        "Called with a valid, clamped value.",
      ],
      ["min, max, step", "number", "—, —, 1", "Range and step."],
      ["unit", "string", "", "Shown after the number."],
      [
        "decrementLabel, incrementLabel",
        "string",
        "",
        "Button names (required).",
      ],
    ],
  },
];
