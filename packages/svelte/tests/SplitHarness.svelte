<script lang="ts">
  import { SplitButton } from "../src/index.ts";

  interface Props {
    onClick: () => void;
    onSelect: (id: string) => void;
  }
  let { onClick, onSelect }: Props = $props();
</script>

<SplitButton
  variant="primary"
  {onClick}
  {onSelect}
  menuLabel="More publish options"
  items={[
    { id: "draft", label: "Save draft" },
    { id: "schedule", label: "Schedule", disabled: true },
    { id: "unpublish", label: "Unpublish" },
  ]}
>
  Publish changes
</SplitButton>
