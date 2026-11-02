<script lang="ts">
  import { Tabs } from "../src/index.ts";

  const items = [
    { id: "a", label: "Overview" },
    { id: "b", label: "Details", disabled: true },
    { id: "c", label: "History" },
  ];
  const text: Record<string, string> = { a: "Panel A", b: "Panel B", c: "Panel C" };
</script>

<Tabs label="Sections" {items}>
  {#snippet panel(id: string)}{text[id]}{/snippet}
</Tabs>
