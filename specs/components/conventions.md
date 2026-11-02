# Component conventions (ADR-005)

## Architecture

1. **Contract first.** `specs/components/contracts.md` is the source of truth: props, states, markup, keyboard and a11y.
2. **One stylesheet.** All component styling lives in `@interstellarforge/matter-css` (`@layer matter.components`), keyed on class names and data attributes. React and Svelte emit the same markup; they add behaviour only where the platform has none (tabs, menu, tooltip).
3. **Native first.** `button`, `input`, `select`, `textarea`, `dialog`. No headless dependency in the MVP; reconsider per component only with a size and licence check (ADR-005).
4. **Same tests.** The same behaviour cases run against React and Svelte (accessible roles and names, keyboard, states).

## Markup conventions

- Class: `m-<component>`; sub-elements `m-<component>__<part>`.
- Variants, sizes and tones are **data attributes**, not class modifiers: `data-variant`, `data-size`, `data-tone`. Boolean states use the native attribute (`disabled`, `aria-invalid`, `aria-checked`, `aria-selected`, `aria-expanded`, `open`).
- No inline colours or sizes; only tokens (`--m-*`). Size follows the density tokens (`--m-control-h`).
- No hardcoded user-facing text. Strings (labels, close buttons, errors) come through props.

## Prop conventions (both frameworks)

| Concern | Convention |
| --- | --- |
| Variants | `variant`: `'primary' | 'secondary' | 'ghost' | 'danger'` (Button); `tone` for status colours (Badge) |
| Size | `size`: `'sm' | 'md' | 'lg'`, default `md` (follows density) |
| Native passthrough | Remaining props go to the root element (`id`, `class`, `aria-*`, `data-*`, handlers). Consumers can add `class`; Matter never removes theirs. |
| Controlled / uncontrolled | Value-bearing components support both: `value` (controlled) or `defaultValue` (uncontrolled) in React; `bind:` support in Svelte. |
| Events | React: callback props `onChange`, `onOpenChange`. Svelte: callback props (`onchange`, `onopenchange`), not `createEventDispatcher`. |
| Children | React: `children`. Svelte 5: `children` snippet. |
| Refs | React 19: `ref` prop. Svelte: `bind:this` on the exposed element where relevant. |
| Naming | PascalCase components, kebab-case files (conventions: StrictPascalCase for React component files). |
| Types | Every public prop type is exported. |

## Server rendering

- Static components (Button, Badge, Card, Input, Textarea, Select, Checkbox) work without JavaScript and without client-only APIs. In React they must not need `'use client'` unless they hold state.
- Stateful components (Switch, Tabs, Dialog, Menu, Tooltip) are client components in React; in Svelte they must render on the server without touching `window`/`document` at module or render time.
- IDs for label/description links use the framework's id primitive (`useId`, Svelte `$props.id()`), never random values at render time (hydration mismatch).

## Testing matrix (per component)

Rendered with an accessible name; every state in the contract; keyboard contract from `specs/interaction/keyboard.md`; axe has no violations in default and error/disabled states; server render produces the same markup as the client for the default state.
