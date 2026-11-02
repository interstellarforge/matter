<script lang="ts">
  import { Tooltip } from "../src/index.ts";
</script>

<Tooltip content="Saves the draft">
  {#snippet children(props)}<button type="button" {...props}>Save</button>{/snippet}
</Tooltip>
