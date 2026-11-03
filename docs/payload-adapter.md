# Payload admin theme (M7)

`@interstellarforge/matter-payload` themes the Payload CMS admin panel with Matter tokens. It is CSS only: no Payload components are replaced, so Payload upgrades stay safe. Status: proof of concept, not yet published (version `0.0.0`).

## Compatibility assessment

Verified against the two consumer apps (Payload `3.92.1` in boven-verwachting, `3.90.2` in ibvs/v2). `diff -r` of `@payloadcms/ui/dist/scss` between the two versions is empty: the styling layer is identical.

| Payload mechanism                   | Finding                                                                                                                                                                                                                     |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Styling model                       | Plain CSS custom properties, declared in `@layer payload-default`. Anything in `@layer payload` (or unlayered) overrides it.                                                                                                |
| Colour mode                         | `html[data-theme="light"\|"dark"]`. Payload owns this attribute.                                                                                                                                                            |
| Variable families                   | `--theme-bg`, `--theme-text`, `--theme-input-bg`, `--theme-border-color`, `--theme-overlay`, `--theme-elevation-0…1000` (step 50), `--theme-success/warning/error-50…950` (step 50), `--style-radius-s/m/l`, `--font-body`. |
| Scale direction                     | Elevation: 0 = page background, 1000 = text, in both modes. Status scales: 50 = soft tint, 950 = strong colour, in both modes (Payload swaps the underlying colours in dark mode).                                          |
| Custom components, views and fields | Not needed for theming. They remain available for later work and can use Matter components (`matter-css` is included).                                                                                                      |

### Attribute clash (the main design problem)

Matter uses `data-theme` for the product theme (`deep-space`, `professional`) and `data-color-mode` for light and dark. Payload uses `data-theme` for light and dark. In the adapter the roles swap: Payload's `data-theme` drives the colour mode, and the Matter product theme moves to `data-matter-theme`.

## Adapter architecture

`dist/matter-payload.css` is generated from `matter.css` in three steps (`packages/payload/src/css.ts`):

1. Declare `@layer payload-default, payload;` first so the layer order is right whichever stylesheet loads first.
2. Rewrite Matter's selectors: `[data-theme` becomes `[data-matter-theme`, then `[data-color-mode` becomes `[data-theme`.
3. Append `@layer payload { … }` that maps the Payload variables onto Matter tokens. Two anchors per family keep one rule valid for light and dark: `--theme-elevation-N: color-mix(var(--m-text) N/10 %, var(--m-bg))` and `--theme-<status>-N: color-mix(var(--m-<status>) N/10 %, var(--m-<status>-soft))`.

## Usage

```tsx
// src/app/(payload)/layout.tsx
import "@payloadcms/next/css";
import "@interstellarforge/matter-payload/matter-payload.css";
```

The default product theme (Deep Space) needs no attribute. Switching to Professional means setting `data-matter-theme="professional"` on `<html>`; how to inject that attribute in Payload's root layout was not verified.

## Proof of concept result

A static harness with Payload's real compiled stylesheet (`@payloadcms/next/dist/prod/styles.css`) plus the adapter, checked in Chromium for light and dark:

- `--theme-bg`, `--theme-text`, `--theme-elevation-0/1000` and the status scales resolve to the Matter values; Payload's own dark rules are overridden.
- `--m-*` tokens resolve under Payload's `data-theme`, so Matter components can be used inside Payload custom views.
- `--style-radius-m` follows Matter's control radius; `--font-body` follows Matter's font.

## Not verified

- The real admin UI. It needs a database; the apps were not started and not modified.
- Payload components that hard-code colours instead of the variables above.
- Setting `data-matter-theme` from Payload's config.
- Payload's primary buttons use the neutral elevation scale, so the admin stays monochrome. Using Matter's accent colour needs overrides of Payload class names, which is more fragile and is not part of this adapter.

## Upgrade risk

| Risk                                                      | Likelihood | Mitigation                                                                                                                                                         |
| --------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Payload renames or drops a variable family                | Low in 3.x | Re-run `grep -o -- '--theme-[a-z0-9-]*' @payloadcms/ui/dist/scss/colors.scss` on every upgrade and compare with `buildMapping()`; the unit test pins the families. |
| Payload changes its layer names                           | Low        | The layer order is declared in one place in the adapter.                                                                                                           |
| Payload changes how the colour mode is set (`data-theme`) | Low        | One rewrite rule in `remapAttributes`.                                                                                                                             |
| Visual regressions inside Payload's pages                 | Medium     | Verify the real admin of both apps before the first release; keep the adapter to variables only.                                                                   |

## Recommendation

Release the adapter after a visual check in both apps. Payload stays optional for Matter; nothing in the other packages depends on this package.
