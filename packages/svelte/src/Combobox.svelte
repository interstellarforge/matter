<script lang="ts">
  import type { ComboboxOption } from "./types.ts";

  interface Props {
    options: ComboboxOption[];
    /** Accessible name of the input (or use `id` with a `<label for>` / FormField). */
    "aria-label"?: string;
    id?: string;
    "aria-describedby"?: string | undefined;
    invalid?: boolean;
    required?: boolean;
    placeholder?: string;
    /** Several values, shown as tags. */
    multiple?: boolean;
    /** Selected values; at most one in single mode. */
    value?: string[];
    onValueChange?: (value: string[]) => void;
    /** Async: called on every input change. Set `filter={false}` to skip local filtering. */
    onQueryChange?: (query: string) => void;
    filter?: boolean;
    loading?: boolean;
    loadingLabel?: string;
    emptyLabel: string;
    clearLabel: string;
    /** Accessible name of a tag's remove button, e.g. `(label) => "Remove " + label`. */
    removeLabel?: (label: string) => string;
    disabled?: boolean;
    class?: string;
  }

  let {
    options,
    multiple = false,
    value = $bindable([]),
    onValueChange,
    onQueryChange,
    filter = true,
    loading = false,
    loadingLabel,
    emptyLabel,
    clearLabel,
    removeLabel,
    placeholder,
    invalid = false,
    disabled = false,
    class: className,
    ...rest
  }: Props = $props();

  const base = $props.id();
  let query: string | undefined = $state();
  let open = $state(false);
  let active = $state(0);

  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;
  const text = $derived(query ?? (multiple ? "" : labelOf(value[0] ?? "")));
  const shown = $derived.by(() => {
    const q = query?.toLowerCase();
    return filter && q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  });
  const showList = $derived(open && shown.length > 0);
  const activeOption = $derived(showList ? shown[Math.min(active, shown.length - 1)] : undefined);

  function commit(next: string[]) {
    value = next;
    onValueChange?.(next);
  }

  function pick(option: ComboboxOption) {
    if (option.disabled) {
      return;
    }
    if (multiple) {
      commit(value.includes(option.value) ? value.filter((v) => v !== option.value) : [...value, option.value]);
      query = "";
      onQueryChange?.("");
    } else {
      commit([option.value]);
      query = undefined;
      open = false;
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        open = true;
        return;
      }
      const step = event.key === "ArrowDown" ? 1 : shown.length - 1;
      active = (Math.min(active, shown.length - 1) + step) % shown.length;
    } else if (event.key === "Enter" && activeOption) {
      event.preventDefault();
      pick(activeOption);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      open = false;
      query = undefined;
    } else if (event.key === "Backspace" && multiple && !text && value.length) {
      commit(value.slice(0, -1));
    }
  }
</script>

<div
  class={["m-combobox", className]}
  onfocusout={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      open = false;
      query = undefined;
    }
  }}
>
  <div class="m-input m-combobox__box" aria-invalid={invalid ? true : undefined}>
    {#if multiple}
      {#each value as v (v)}
        <span class="m-badge m-combobox__tag" data-tone="accent">
          {labelOf(v)}
          <button
            type="button"
            aria-label={removeLabel?.(labelOf(v)) ?? labelOf(v)}
            {disabled}
            onclick={() => { commit(value.filter((x) => x !== v)); }}
          >
            ×
          </button>
        </span>
      {/each}
    {/if}
    <input
      {...rest}
      class="m-combobox__input"
      role="combobox"
      aria-expanded={showList}
      aria-controls={`${base}-list`}
      aria-autocomplete="list"
      aria-activedescendant={activeOption ? `${base}-${activeOption.value}` : undefined}
      aria-invalid={invalid ? true : undefined}
      autocomplete="off"
      {disabled}
      {placeholder}
      value={text}
      oninput={(event) => {
        query = event.currentTarget.value;
        active = 0;
        open = true;
        onQueryChange?.(query);
      }}
      onclick={() => (open = true)}
      onkeydown={onKeyDown}
    />
    {#if value.length > 0 && !disabled}
      <button
        type="button"
        class="m-combobox__clear"
        aria-label={clearLabel}
        onclick={() => {
          commit([]);
          query = undefined;
        }}
      >
        ×
      </button>
    {/if}
  </div>
  <ul
    id={`${base}-list`}
    role="listbox"
    class="m-combobox__list"
    aria-multiselectable={multiple ? true : undefined}
    aria-label={rest["aria-label"]}
    hidden={!showList}
  >
    {#each shown as option (option.value)}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <li
        id={`${base}-${option.value}`}
        role="option"
        class="m-combobox__option"
        aria-selected={value.includes(option.value)}
        aria-disabled={option.disabled ? true : undefined}
        data-active={option === activeOption ? "" : undefined}
        onmousedown={(event) => { event.preventDefault(); }}
        onclick={() => { pick(option); }}
      >
        {option.label}
      </li>
    {/each}
  </ul>
  {#if open && (loading || shown.length === 0)}
    <div class="m-combobox__list m-combobox__status" role="status">
      {loading ? loadingLabel : emptyLabel}
    </div>
  {/if}
</div>
