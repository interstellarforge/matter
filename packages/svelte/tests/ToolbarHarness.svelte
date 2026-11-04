<script lang="ts">
  import { Button, EditorFrame, Toolbar } from "../src/index.ts";
</script>

<EditorFrame invalid>
  {#snippet toolbar()}
    <Toolbar label="Formatting">
      <Button aria-pressed="true">Bold</Button>
      <Button aria-pressed="false">Italic</Button>
    </Toolbar>
  {/snippet}
  <div class="m-editor__content" contenteditable="true" role="textbox" aria-label="Body"></div>
</EditorFrame>
