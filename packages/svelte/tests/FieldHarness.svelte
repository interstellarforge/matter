<script lang="ts">
  import { FormField, Input } from "../src/index.ts";
</script>

<FormField label="Email" hint="Work address" error="Enter a valid email" requiredLabel="(required)">
  {#snippet children(control)}
    <Input {...control} />
  {/snippet}
</FormField>
