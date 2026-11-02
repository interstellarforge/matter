# Pattern: loading, empty, error and success states

Derived from Atlas (`EmptyState.svelte`: icon, title, optional text, optional action, compact variant) and the Pulsar mockups. The component contract is neutral; React and Svelte implement the same props.

## Contract

| State      | Content                                                                                                                                            | Role / announcement                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Loading    | Skeleton shaped like the final content (preferred) or a spinner for short actions. Show nothing for loads under ~200 ms.                           | Container `aria-busy="true"`; do not announce every skeleton. For long waits, a polite live-region message.  |
| Empty      | Icon, title (what is missing), optional text (why/what to do), optional primary action. Variants: `default`, `compact` (inside a column or panel). | Static content, no live region.                                                                              |
| No results | Like Empty, but names the filter/search and offers "clear filters".                                                                                | Update a polite live region with the result count when filters change.                                       |
| Error      | Title (what failed), text (what the user can do), retry action. Keep technical detail out of the main text.                                        | `role="alert"` when it appears after a user action; otherwise static.                                        |
| Success    | Short confirmation near the action (inline or toast). Persistent success only when the next step needs it.                                         | Polite live region (`role="status"`); toasts must not disappear before they can be read (min 5 s, pausable). |

## Rules

- Empty and error states use `--m-text-muted` for secondary text and `--m-accent` for the icon tile; error accents use `--m-danger` with an icon.
- Primary action is a real `button`/link; the compact variant keeps the action reachable by keyboard.
- Layout stability: reserve space so content does not jump between loading and loaded.
- Optimistic UI is a product decision; Matter only supplies the visual states.
- All strings come from props.

## Props (proposal, finalise in MATTER-49)

`EmptyState`: `icon`, `title`, `text?`, `compact?`, children = actions. `Skeleton`: `shape`, `lines?`. Toast and Spinner are Future (not in the MVP set).
