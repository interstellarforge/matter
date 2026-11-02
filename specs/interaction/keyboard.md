# Keyboard interaction contracts (MVP components)

Source of truth for React and Svelte implementations (ADR-005). Based on the WAI-ARIA Authoring Practices Guide.

| Component          | Role / element                                       | Keys                                                                                                                                       |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Button, IconButton | `button`                                             | `Enter`, `Space` activate. IconButton requires an accessible name.                                                                         |
| Input, Textarea    | `input`, `textarea`                                  | Native. Label via `label` or `aria-labelledby`; errors via `aria-describedby`.                                                             |
| Checkbox           | `input[type=checkbox]`                               | `Space` toggles. Mixed state via `aria-checked="mixed"`.                                                                                   |
| Switch             | `button[role=switch]`                                | `Space` and `Enter` toggle; `aria-checked`.                                                                                                |
| Select             | native `select` first; custom listbox only if needed | Native: `↑↓`, type-ahead. Custom: `↑↓`, `Home`, `End`, type-ahead, `Enter` select, `Esc` close.                                            |
| Tabs               | `tablist`/`tab`/`tabpanel`                           | `←→` move (and activate), `Home`/`End`, `Tab` enters the panel. Roving `tabindex`. Vertical: `↑↓`.                                         |
| Menu               | `menu`/`menuitem`                                    | Trigger: `Enter`/`Space`/`↓` open. In menu: `↑↓`, `Home`, `End`, type-ahead, `Enter` activate, `Esc` close and return focus to trigger.    |
| Dialog             | `dialog` (modal)                                     | Focus moves inside on open, `Tab` cycles inside, `Esc` closes, focus returns to the trigger. Background inert. `aria-labelledby` required. |
| Tooltip            | `role=tooltip`                                       | Appears on focus and hover, `Esc` dismisses, content stays reachable on hover. Never the only place for essential information.             |
| Badge, Card        | static                                               | No keyboard behaviour. A clickable Card uses a real link or button, not a click handler on a `div`.                                        |

## Common rules

- `Esc` always closes the topmost overlay only.
- Roving `tabindex` for composite widgets (tabs, menus); one tab stop per widget.
- Disabled controls: use `disabled` (not focusable) unless the control explains why via `aria-disabled` and stays focusable.
- Touch: same actions as pointer; no hover-only functionality.
