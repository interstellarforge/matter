# @interstellarforge/matter-tokens

Framework-agnostic design tokens for Matter. Source: [DTCG Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/) (Final Community Group Report), built with Style Dictionary 5.

## Layers

| Layer     | Where                                      | Notes                                                          |
| --------- | ------------------------------------------ | -------------------------------------------------------------- |
| Primitive | `tokens/core.json`                         | space, radius, type scale, weights, line-height, fonts, motion |
| Semantic  | `tokens/themes/<theme>/<light\|dark>.json` | colour roles and shadows; one file per theme and colour mode   |
| Theme     | `tokens/themes/<theme>/theme.json`         | theme-wide values, e.g. `control-radius`                       |
| Density   | `tokens/density/<name>.json`               | control height, padding, gap, font size, row height            |

Colour primitives are not a separate layer yet: themes hold their palette directly (ADR-006: simplicity before abstraction). Component tokens only when proven necessary.

## Naming

CSS custom property: `--m-<path>`; the leading `color` group is dropped. `color.surface.raised` becomes `--m-surface-raised`, `space.4` becomes `--m-space-4`.

## Switching

Attributes on `<html>`:

- `data-theme="deep-space|professional|pulsar"` (default: `deep-space`)
- `data-color-mode="light|dark"` (default: OS preference; a theme without light mode uses its only mode)
- `data-density="compact|comfortable|touch"` (default: `comfortable`; may be set on any element)

Use `themeInitScript` from `@interstellarforge/matter-css` in `<head>` to apply stored values before first paint.

## Adding a theme

1. Create `tokens/themes/<name>/theme.json` plus at least one mode file with the same token names as the others.
2. `pnpm build` fails when token sets differ or text contrast is below 4.5:1.

## Scripts

`pnpm build` writes `dist/` (CSS, `index.js`/`index.d.ts`, `tokens.index.json`); `pnpm test` runs Vitest.
