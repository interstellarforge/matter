# Keyboard interaction contracts (MVP components)

Source of truth for React and Svelte implementations (ADR-005). Based on the WAI-ARIA Authoring Practices Guide.

| Component          | Role / element                                       | Keys                                                                                                                                                                  |
| ------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button, IconButton | `button`                                             | `Enter`, `Space` activate. IconButton requires an accessible name.                                                                                                    |
| Input, Textarea    | `input`, `textarea`                                  | Native. Label via `label` or `aria-labelledby`; errors via `aria-describedby`.                                                                                        |
| Checkbox           | `input[type=checkbox]`                               | `Space` toggles. Mixed state via `aria-checked="mixed"`.                                                                                                              |
| Switch             | `button[role=switch]`                                | `Space` and `Enter` toggle; `aria-checked`.                                                                                                                           |
| Select             | native `select` first; custom listbox only if needed | Native: `↑↓`, type-ahead. Custom: `↑↓`, `Home`, `End`, type-ahead, `Enter` select, `Esc` close.                                                                       |
| Tabs               | `tablist`/`tab`/`tabpanel`                           | `←→` move (and activate), `Home`/`End`, `Tab` enters the panel. Roving `tabindex`. Vertical: `↑↓`.                                                                    |
| Menu               | `menu`/`menuitem`                                    | Trigger: `Enter`/`Space`/`↓` open. In menu: `↑↓`, `Home`, `End`, type-ahead, `Enter` activate, `Esc` close and return focus to trigger.                               |
| Dialog             | `dialog` (modal)                                     | Focus moves inside on open, `Tab` cycles inside, `Esc` closes, focus returns to the trigger. Background inert. `aria-labelledby` required.                            |
| Tooltip            | `role=tooltip`                                       | Appears on focus and hover, `Esc` dismisses, content stays reachable on hover. Never the only place for essential information.                                        |
| Combobox           | `input[role=combobox]` + `listbox`                   | `↓`/`↑` open and move (wraps), `Enter` selects active option, `Esc` closes, `Backspace` on empty input removes last tag (multiple). Focus stays in the input.         |
| Data table         | `table`, sort `button` in `th`                       | Native: `Tab` to sort buttons and checkboxes, `Enter`/`Space` activate. `aria-sort` on the sorted column.                                                             |
| Sidebar            | `nav` with links                                     | `Tab` through links; group heading buttons toggle with `Enter`/`Space` (`aria-expanded`).                                                                             |
| Date picker        | `input[type=date]` + calendar `dialog`/`grid`        | Calendar: arrows move a day/week, `Home`/`End` week edges, `PageUp`/`PageDown` month (`Shift`: year), `Enter`/`Space` choose, `Esc` closes and returns to the toggle. |
| Split button       | `button` + `button[aria-haspopup=menu]` + `menu`     | `Tab` main, then trigger. Trigger: `↓`/`↑` open; in menu `↑↓`, `Home`, `End`, `Enter`, `Esc` closes and returns focus to the trigger.                                 |
| Pagination         | `nav` with buttons                                   | `Tab`, `Enter`/`Space`. Current page has `aria-current="page"`.                                                                                                       |
| Toast              | `role=status` / `alert`                              | Timer pauses on hover and focus; dismiss and action are buttons. Never the only place for essential information.                                                      |
| Drawer             | `dialog` (modal)                                     | As Dialog.                                                                                                                                                            |
| File upload        | `input[type=file]` in a label                        | `Tab` focuses the area, `Enter`/`Space` opens the file picker.                                                                                                        |
| Toolbar            | `toolbar`                                            | One tab stop (roving `tabindex`). `←→` move (wraps), `Home`/`End`. Toggle buttons use `aria-pressed`; editor content is a `textbox` outside the toolbar.                |
| Badge, Card        | static                                               | No keyboard behaviour. A clickable Card uses a real link or button, not a click handler on a `div`.                                                                   |

## Common rules

- `Esc` always closes the topmost overlay only.
- Roving `tabindex` for composite widgets (tabs, menus); one tab stop per widget.
- Disabled controls: use `disabled` (not focusable) unless the control explains why via `aria-disabled` and stays focusable.
- Touch: same actions as pointer; no hover-only functionality.
