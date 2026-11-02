# Accessibility baseline (ADR-011, proposed)

Target: **WCAG 2.2 level AA** for every Matter component and theme, in every colour mode and density.

## Rules

1. **Contrast.** Text 4.5:1 (3:1 for large text), UI component boundaries and focus indicators 3:1. Enforced for text pairs in `packages/tokens/src/validate.ts` (build fails); the 3:1 pairs are warnings until each product has validated them.
2. **Colour is never the only signal.** Status (danger/warning/success/info) always has an icon or text label.
3. **Keyboard.** Everything operable by mouse or touch is operable by keyboard, in logical order, without traps. Patterns: `specs/interaction/keyboard.md` (follow the WAI-ARIA Authoring Practices).
4. **Focus.** A visible focus ring using `--m-focus` with `--m-focus-halo` offset; never `outline: none` without replacement. Dialogs trap focus and restore it to the trigger on close.
5. **Target size.** Pointer targets at least 24×24 CSS px (WCAG 2.5.8); the `touch` density uses at least 44 px.
6. **Motion.** Respect `prefers-reduced-motion`: no non-essential motion; transitions fall back to 0 ms.
7. **Names and roles.** Native elements first (`button`, `input`, `dialog`); ARIA only to fill gaps. Every control has an accessible name; Matter components take text via props (no hardcoded UI strings).
8. **Zoom and reflow.** Usable at 200% zoom and 320 px width without two-dimensional scrolling (data tables excepted).
9. **Forms.** Visible labels, error messages linked with `aria-describedby`, errors announced (`role="alert"` or live region), required state not colour-only.

## Verification

| Level                      | Tool                    | When                                             |
| -------------------------- | ----------------------- | ------------------------------------------------ |
| Token contrast             | `pnpm build` (tokens)   | every build                                      |
| Component automated        | axe-core via Playwright | CI, per component and state (from EPIC 05/06/07) |
| Keyboard and screen reader | manual checklist below  | per new component, before release                |

### Manual checklist per component

- [ ] Tab order logical; no keyboard trap
- [ ] All states visible: hover, focus, active, disabled, loading, error
- [ ] Focus ring visible in every theme/mode
- [ ] VoiceOver (macOS/Safari) announces name, role, state
- [ ] Works at 200% zoom and in `touch` density
- [ ] `prefers-reduced-motion` honoured

## Known findings

- `deep-space/light`: `border-strong` is 2.15–2.32:1 on `bg`/`surface` (below 3:1). Source: Atlas light tokens. Decide per use: decorative borders are exempt, input borders are not.
