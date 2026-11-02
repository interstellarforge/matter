<script lang="ts">
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
  } from "../src/index.ts";
</script>

<Button variant="primary">Go</Button>
<Input aria-label="Name" />
<Checkbox>Accept</Checkbox>
<Switch aria-label="Remote" checked />
<Badge tone="info">New</Badge>
<Tabs label="Sections" items={[{ id: "a", label: "A" }]}>
  {#snippet panel()}Panel{/snippet}
</Tabs>
<Dialog title="T" closeLabel="Close">Body</Dialog>
<Tooltip content="Hint">
  {#snippet children(props)}<button type="button" {...props}>Trigger</button>{/snippet}
</Tooltip>
<Menu triggerLabel="Actions" items={[{ id: "a", label: "A" }]} onSelect={() => undefined} />
