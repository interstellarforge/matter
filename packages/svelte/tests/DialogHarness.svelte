<script lang="ts">
  import { Button, Dialog } from "../src/index.ts";

  let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Open</Button>
<Dialog bind:open title="Settings" closeLabel="Close">Body</Dialog>
