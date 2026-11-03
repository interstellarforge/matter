<script lang="ts">
  import { Select } from "@interstellarforge/matter-svelte";
  import { onMount } from "svelte";

  const options: Record<string, string[]> = {
    theme: ["deep-space", "professional", "pulsar"],
    "color-mode": ["system", "light", "dark"],
    density: ["comfortable", "compact", "touch"],
  };
  const keys = Object.keys(options);
  const defaults: Record<string, string> = { theme: "deep-space", "color-mode": "system", density: "comfortable" };

  // Server render uses the defaults; onMount adopts what the init script already applied.
  let values: Record<string, string> = $state({ ...defaults });

  onMount(() => {
    for (const key of keys) {
      values[key] = document.documentElement.getAttribute(`data-${key}`) ?? defaults[key];
    }
  });

  function apply(key: string, value: string) {
    values[key] = value;
    if (value === "system") {
      document.documentElement.removeAttribute(`data-${key}`);
      localStorage.removeItem(`matter-${key}`);
    } else {
      document.documentElement.setAttribute(`data-${key}`, value);
      localStorage.setItem(`matter-${key}`, value);
    }
  }
</script>

<div class="row">
  {#each keys as key (key)}
    <label>
      <span>{key}</span>
      <Select aria-label={key} value={values[key]} onchange={(event) => { apply(key, event.currentTarget.value); }}>
        {#each options[key] ?? [] as option (option)}<option value={option}>{option}</option>{/each}
      </Select>
    </label>
  {/each}
</div>

<style>
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--m-space-3);
  }
  label {
    display: grid;
    gap: var(--m-space-1);
  }
  span {
    color: var(--m-text-muted);
    font-size: var(--m-fs-sm);
  }
</style>
