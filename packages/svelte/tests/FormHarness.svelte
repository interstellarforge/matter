<script lang="ts">
  import { search } from "@interstellarforge/matter-icons";
  import {
    Avatar,
    Badge,
    Banner,
    Button,
    Card,
    Checkbox,
    EmptyState,
    Input,
    ProgressBar,
    Switch,
  } from "../src/index.ts";
</script>

<form>
  <label for="n">Name</label>
  <Input id="n" />
  <Checkbox>Accept</Checkbox>
  <Switch aria-label="Remote" />
  <Input aria-label="Search" icon={search} />
  <Avatar name="Ada Lovelace" />
  <Banner tone="warning" title="Heads up">Check this</Banner>
  <ProgressBar label="Upload" value={40} />
  <EmptyState title="Nothing here">Add one</EmptyState>
  <Badge tone="success">Done</Badge>
  <Card padded>Content</Card>
  <Button variant="primary" type="submit">Send</Button>
</form>
