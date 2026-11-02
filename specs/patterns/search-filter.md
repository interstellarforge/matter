# Pattern: search and filters

Derived from Atlas (`Filters.svelte`: search input plus labelled selects and a clear action in a `role="search"` region) and the Pulsar vacancy overview (search field, filter panel with reset, active chips, sort).

## Structure

- The region is a landmark: `role="search"` with an accessible name from props.
- Search input: `type="search"`, visible or `aria-label` name, `Enter` submits (or debounced live search; 250 ms, never on every keystroke for network calls), `Esc` clears when it has text.
- Filters: native controls first (`select`, checkbox, switch, range). Each has a visible or `aria-label` name.
- A **Reset/Clear** action is always present once any filter is active, and resets everything with one action.
- Active filters are visible as removable chips or as marked controls; each chip's remove button names the filter ("Remove filter: Remote").
- Sorting is a separate control from filtering.

## Behaviour

- Filter state is reflected in the URL (query string) by the product so results can be shared and restored; Matter stays state-agnostic.
- Results count is announced in a polite live region ("24 results"); zero results show the No results state with a clear action.
- On narrow viewports the filter panel becomes a disclosure/drawer; focus returns to its trigger on close.
- Applying filters never moves focus unexpectedly; "Apply" buttons are only used when applying is expensive.

## Density

Controls use `--m-control-h` and `--m-control-gap`; in `touch` density filters stack vertically with 44 px+ targets.

## Strings

Labels, placeholders, chip text and counts come from props (i18n by the app).
