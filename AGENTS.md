# Matter: agent rules

Matter = Interstellarforge design system (tokens, CSS, icons, React, Svelte). Generic visual/interaction building blocks only.

## Architecture

- Packages: `tokens` (DTCG → CSS), `css` (shared `components.css`), `icons`, `react`, `svelte`. `tokens`/`css`/`icons` are framework-free; `react` never imports svelte and vice versa (`pnpm check:deps`).
- Component contract lives in `specs/components`; styling is shared (`m-<component>` + `data-variant|size|tone`). React and Svelte stay thin.
- No business logic. New component only if needed by ≥2 apps or a primitive. Search existing first. No new deps without motivation.

## Design

- Semantic tokens only (`--m-*`); no hardcoded colours, sizes or radii.
- Respect `data-theme`, `data-color-mode`, `data-density`.
- Component CSS lives in `@layer matter.components`.

## Components

- Document the API and states in `specs/components`. Test states, a11y (axe) and core interactions. Keep the bundle small (`pnpm check:size`).
- React: interactive components are `"use client"` (`client-boundary.test.ts`).
- UI text comes in via props; never hardcode it.

## Workflow

- Node 24, pnpm; exact versions via the catalog. Before finishing: `pnpm format && pnpm typecheck && pnpm lint && pnpm test && pnpm build`.
- Atlas project `MATTER`: check it before work, reuse tickets, record architecture decisions as ADRs, close only after validation.
- Never commit, push or tag unless asked. Never publish locally; releases run in CI (`docs/releasing.md`).
- Generated files (`dist`, `tokens.index.json`) are not edited by hand.

## Consumers

Snippet for apps: `docs/agents-consumer.md`.
