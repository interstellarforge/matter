<script lang="ts">
  import { chevronDown, search } from "@interstellarforge/matter-icons";
  import {
    Badge,
    Button,
    Card,
    Checkbox,
    Dialog,
    Icon,
    IconButton,
    Input,
    Menu,
    Switch,
    Tabs,
    Tooltip,
  } from "@interstellarforge/matter-svelte";

  import ThemeSwitcher from "./ThemeSwitcher.svelte";

  let open = $state(false);
  let last = $state("none");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "details", label: "Details", disabled: true },
    { id: "history", label: "History" },
  ];
</script>

<h1>Matter on SvelteKit</h1>
<ThemeSwitcher />

<Card padded>
  <div class="stack">
    <Badge tone="success">Server rendered</Badge>
    <Input aria-label="Search vacancies" placeholder="Search vacancies" />
    <div><Button variant="primary" type="submit">Save</Button></div>
  </div>
</Card>

<div class="row">
  <Button variant="primary" onclick={() => (open = true)}>Open dialog</Button>
  <Menu
    triggerLabel="Actions"
    items={[
      { id: "edit", label: "Edit" },
      { id: "archive", label: "Archive", disabled: true },
      { id: "delete", label: "Delete" },
    ]}
    onSelect={(id) => (last = id)}
  />
  <Tooltip content="Search everything">
    {#snippet children(props)}
      <IconButton label="Search" {...props}><Icon icon={search} /></IconButton>
    {/snippet}
  </Tooltip>
  <Switch aria-label="Remote only" />
  <Checkbox indeterminate>Select all</Checkbox>
  <Icon icon={chevronDown} label="Expand" />
  <span data-testid="last-action">Last action: {last}</span>
</div>

<Tabs label="Sections" items={tabs}>
  {#snippet panel(id)}{id === "overview" ? "Overview panel" : "History panel"}{/snippet}
</Tabs>

<Dialog bind:open title="Settings" closeLabel="Close">
  Dialog body
  {#snippet footer()}<Button onclick={() => (open = false)}>Done</Button>{/snippet}
</Dialog>

<style>
  h1 {
    margin: 0;
    font-size: var(--m-fs-2xl);
  }
  .stack {
    display: grid;
    gap: var(--m-space-3);
  }
  .row {
    display: flex;
    gap: var(--m-space-3);
    align-items: center;
    flex-wrap: wrap;
  }
</style>
