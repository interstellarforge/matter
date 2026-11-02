<script lang="ts">
  import { Menu } from "../src/index.ts";

  let { onSelect }: { onSelect: (id: string) => void } = $props();
  const items = [
    { id: "edit", label: "Edit" },
    { id: "archive", label: "Archive", disabled: true },
    { id: "delete", label: "Delete" },
  ];
</script>

<Menu triggerLabel="Actions" {items} {onSelect} />
