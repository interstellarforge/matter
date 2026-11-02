# Atlas pilot (M4): report and migration guide

Branch `matter-pilot` of the Atlas repo, worktree `~/Documents/prive/repos/Atlas-matter-pilot` (uncommitted, based on `dev`). Atlas tracking: ATL-340. Matter tracking: MATTER-58 and MATTER-59.

Matter was linked with `link:` paths (`../../matter/packages/{css,icons,svelte}`) because nothing is published yet. After the first release these become normal npm versions.

## What the pilot changed in Atlas (9 files, +117 / −244)

| Area            | Change                                                                                                                                                                                                                                                                        |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colours         | `tokens.css`: the 35 shared roles (`--atlas-bg`, `--atlas-surface`, `--atlas-accent`, …) are now aliases of `--m-*` from `@interstellarforge/matter-css` (deep-space theme). Atlas-only tokens (workflow status `--atlas-st-*`, brand, hero art, glow, purple) stay in Atlas. |
| Theme attribute | Atlas `data-theme="light\|dark"` became Matter's `data-color-mode` (`theme.svelte.ts`, `public/theme-init.js`). The localStorage key `atlas-theme` is unchanged.                                                                                                              |
| Density         | One product override: `--m-control-h: 38px` (Atlas controls are 38 px; Matter comfortable is 36).                                                                                                                                                                             |
| Icons           | `Icon.svelte` renders Matter's icon definitions (`icons[name]`); `icons.ts` only re-exports the `IconName` type. The 52 paths were identical.                                                                                                                                 |
| Filters         | Seven `<select>` → Matter `Select`, two checkboxes → `Checkbox`, clear button → `Button variant="ghost"`. The composite search field (icon + input) stays Atlas.                                                                                                              |
| Not touched     | Board, Card, virtualisation, drag-and-drop, keyboard handling.                                                                                                                                                                                                                |

## Component mapping (Atlas → Matter)

| Atlas                             | Matter                                                            | Status        |
| --------------------------------- | ----------------------------------------------------------------- | ------------- |
| `select` in Filters               | `Select`                                                          | done in pilot |
| `input[type=checkbox]` in Filters | `Checkbox`                                                        | done in pilot |
| Clear / ghost button              | `Button variant="ghost"`                                          | done in pilot |
| `Icon.svelte`                     | `Icon` + `matter-icons`                                           | done in pilot |
| `StatusChip`                      | `Badge` (tones exist; Atlas workflow colours need `--atlas-st-*`) | next          |
| `.atlas-btn`, other buttons       | `Button` / `IconButton`                                           | next          |
| `EmptyState`                      | none yet (follow-up component)                                    | gap           |
| Search field with icon            | none yet (input with adornment)                                   | gap           |
| `Avatar`, `Banner`, `ProgressBar` | none yet                                                          | gap           |
| Item panel, modals                | `Dialog` (check focus and backdrop against current behaviour)     | later         |

## Results (same data, seeded 300 items, Chromium)

| Check                                                 | Baseline                | Pilot                                                                          |
| ----------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------ |
| Kanban card height                                    | 140 px (45 cards)       | 140 px (45 cards)                                                              |
| Drag and drop (pointer)                               | card moves 300 px right | same                                                                           |
| Keyboard move (Alt+Arrow)                             | result recorded         | same result                                                                    |
| Select / input / button height                        | 38 / 38 / 38 px         | 38 / 38 / 38 px                                                                |
| Body colours, accent, primary button (light and dark) | recorded                | identical                                                                      |
| `color-scheme`                                        | light / dark            | light / dark                                                                   |
| Pixel diff (threshold 12/255)                         | –                       | light 0.118 %, dark 0.147 %, only the two filter checkboxes (about 4 px shift) |
| Build JS gzip                                         | 142 932 B               | 145 213 B (+2 281 B, +1.6 %)                                                   |
| Build CSS gzip                                        | 14 465 B                | 16 169 B (+1 704 B, +11.8 %)                                                   |
| Total JS + CSS gzip                                   | 157.4 kB                | 161.4 kB (budget in the brief: 250 kB; not documented in Atlas)                |
| Console errors                                        | none                    | none                                                                           |

Screenshots: `design/pilot/{baseline,pilot}-{light,dark}.png`. Not tested: the item panel, list/backlog/hierarchy views, mobile layouts, the timeline, and the SSE live updates.

## Findings

1. **Unlayered global CSS beats Matter's layered CSS.** Atlas has global `input, select, textarea { min-height: 40px; padding … }` rules. Matter's component styles live in `@layer matter.components`, so Atlas's unlayered rules win (this made selects 40 px instead of 38 px). Migration fix: move Atlas's global element rules into a layer declared before `matter.components` (or delete them as components migrate). The pilot used a local override instead.
2. **Theme attribute clash.** Atlas used `data-theme` for light/dark; Matter uses `data-color-mode` and reserves `data-theme` for the product theme. Three files changed; both attributes can coexist during a migration.
3. **Strict CSP.** Atlas forbids inline scripts. Matter's `themeInitScript` is an inline string, so `@interstellarforge/matter-css` now also ships `theme-init.js` (loadable with `<script src>`). The pilot kept Atlas's own file because of its legacy storage key.
4. **`color-scheme` was missing in Matter.** Found by comparing computed styles; Matter now sets it per colour mode (native controls, scrollbars, form popups).
5. **Atlas control height is 38 px**, Matter's densities are 28 / 36 / 48. Product override for now; decide whether to adopt 38 (or 40) as Matter's comfortable height.
6. **Atlas filters use 12 px semibold controls**, Matter uses 14 px regular. Kept via a product override. Candidate Matter token: a smaller control font size per density.
7. **Missing Matter pieces:** input with leading icon, EmptyState, Avatar, Banner, ProgressBar.
8. **CSS size:** all component CSS ships even if only three components are used (+1.7 kB gzip). Consider per-component CSS or tree-shakable styles.

## Migrating the rest of Atlas

1. Merge the colour aliases and attribute change first (visually neutral).
2. Layer Atlas's global element styles (finding 1), then migrate button and input variants one view at a time.
3. Replace `StatusChip`, `PriorityIndicator` and `TypeIcon` with `Badge` / `Icon` once the status colours map to Matter tones.
4. Replace the Atlas `docs/design` token file with a pointer to Matter (and fix the 88 px mention, ATL-338).
5. Switch the `link:` dependencies to npm versions after v0.1.0.
