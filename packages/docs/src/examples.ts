/** Live examples per component: the shared markup (framework-neutral) plus how to write it in each framework. */
export interface Example {
  component: string;
  html: string;
  react: string;
  svelte: string;
}

export const examples: Example[] = [
  {
    component: "Button",
    html: `<button class="m-button" data-variant="primary">Save</button>
<button class="m-button" data-variant="secondary">Cancel</button>
<button class="m-button" data-variant="ghost">Skip</button>
<button class="m-button" data-variant="danger">Delete</button>`,
    react: `<Button variant="primary">Save</Button>`,
    svelte: `<Button variant="primary">Save</Button>`,
  },
  {
    component: "Input",
    html: `<span class="m-input-icon"><svg class="m-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input class="m-input" aria-label="Search" placeholder="Search"></span>
<input class="m-input" aria-label="Invalid" aria-invalid="true" value="Oops">`,
    react: `<Input aria-label="Search" icon={search} placeholder="Search" />`,
    svelte: `<Input aria-label="Search" icon={search} placeholder="Search" />`,
  },
  {
    component: "Badge",
    html: `<span class="m-badge">Neutral</span>
<span class="m-badge" data-tone="accent">Accent</span>
<span class="m-badge" data-tone="success">Success</span>
<span class="m-badge" data-tone="warning">Warning</span>
<span class="m-badge" data-tone="danger">Danger</span>`,
    react: `<Badge tone="success">Done</Badge>`,
    svelte: `<Badge tone="success">Done</Badge>`,
  },
  {
    component: "Banner",
    html: `<div class="m-banner" data-tone="info" role="status"><div class="m-banner__title">Heads up</div>A short message.</div>
<div class="m-banner" data-tone="danger" role="alert">Something failed.</div>`,
    react: `<Banner tone="info" title="Heads up">A short message.</Banner>`,
    svelte: `<Banner tone="info" title="Heads up">A short message.</Banner>`,
  },
  {
    component: "ProgressBar",
    html: `<div class="m-progress" role="progressbar" aria-label="Upload" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" style="--m-progress:40%"><div class="m-progress__bar"></div></div>`,
    react: `<ProgressBar label="Upload" value={40} />`,
    svelte: `<ProgressBar label="Upload" value={40} />`,
  },
  {
    component: "Avatar",
    html: `<span class="m-avatar" data-size="sm" role="img" aria-label="Ada Lovelace">AL</span>
<span class="m-avatar" role="img" aria-label="Grace Hopper">GH</span>
<span class="m-avatar" data-size="lg" role="img" aria-label="Alan Turing">AT</span>`,
    react: `<Avatar name="Ada Lovelace" size="lg" />`,
    svelte: `<Avatar name="Ada Lovelace" size="lg" />`,
  },
  {
    component: "EmptyState",
    html: `<div class="m-empty"><div class="m-empty__title">No results</div><div>Try a different filter.</div></div>`,
    react: `<EmptyState title="No results" action={<Button>Clear</Button>}>Try a different filter.</EmptyState>`,
    svelte: `<EmptyState title="No results">Try a different filter.{#snippet action()}<Button>Clear</Button>{/snippet}</EmptyState>`,
  },
  {
    component: "Card",
    html: `<div class="m-card" data-padded>Card content</div>`,
    react: `<Card padded>Card content</Card>`,
    svelte: `<Card padded>Card content</Card>`,
  },
];
