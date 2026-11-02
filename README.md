# Matter

Interstellarforge Design & Experience System. One foundation, multiple product identities.

Status: **pre-release (0.x), M2 in progress.** Planning, ADRs and decisions live in Atlas (project `MATTER`), not in this file.

## Packages

| Package                                                           | Purpose                                         | Status       |
| ----------------------------------------------------------------- | ----------------------------------------------- | ------------ |
| `@interstellarforge/matter-tokens`                                | DTCG tokens, CSS and TypeScript output          | working      |
| `@interstellarforge/matter-css`                                   | token stylesheet and no-flash theme init script | working      |
| `matter-icons`, `matter-react`, `matter-svelte`, `matter-payload` | planned                                         | M3 and later |

`tokens` and `css` must stay framework-free (`pnpm test` checks this).

## Commands

```bash
pnpm install
pnpm build        # tokens, then css
pnpm test
pnpm typecheck && pnpm lint && pnpm format
pnpm check:size   # gzip budget for matter.css
```

Requires Node 24 and pnpm. Packages publish to GitHub Packages under `@interstellarforge` (see `.npmrc`; the token never goes in the repo).

## Layout

- `packages/`: published packages
- `specs/`: framework-neutral contracts (accessibility, interaction)
- `design/`: reference screens and prototype (not published)
