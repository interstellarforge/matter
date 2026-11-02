<script lang="ts">
  import { Badge, Button, Card, Checkbox, Input, Switch } from "../src/index.ts";
</script>

<form>
  <label for="n">Name</label>
  <Input id="n" />
  <Checkbox>Accept</Checkbox>
  <Switch aria-label="Remote" />
  <Badge tone="success">Done</Badge>
  <Card padded>Content</Card>
  <Button variant="primary" type="submit">Send</Button>
</form>
