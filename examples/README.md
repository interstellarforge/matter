# Matter examples

Two minimal apps that use Matter the way a product would. They are not published.

| Example     | Stack                                                                | Port |
| ----------- | -------------------------------------------------------------------- | ---- |
| `nextjs`    | Next.js 16 (App Router), React 19, `@interstellarforge/matter-react` | 3101 |
| `sveltekit` | SvelteKit 2, Svelte 5, `@interstellarforge/matter-svelte`            | 3102 |

```bash
pnpm install && pnpm build          # build the packages first (the examples consume their dist/)
pnpm --filter matter-example-nextjs start      # http://localhost:3101
pnpm --filter matter-example-sveltekit start   # http://localhost:3102
```

Both pages show: server-rendered `Card`, `Badge`, `Input` and `Button`; interactive `Dialog`, `Menu`, `Tooltip`, `Tabs`, `Switch`, `Checkbox`; and a switcher for theme, colour mode and density that persists to `localStorage` (`matter-theme`, `matter-color-mode`, `matter-density`).

## What to look at

- **No theme flash.** `themeInitScript` is inlined in `<head>` (Next: `app/layout.tsx`; SvelteKit: `src/hooks.server.ts` + `%matter.init%` in `app.html`). With JavaScript disabled the page already has the stored theme, colour mode and density.
- **Hydration.** No hydration warnings in the browser console.
- **React boundary.** `app/page.tsx` is a server component; interactive components are imported from client files (`Gallery.tsx`, `ThemeSwitcher.tsx`).
- **Native dialog.** `Dialog` opens as a real modal (focus trap, `Esc`, token-coloured backdrop).

These checks were run by hand with Playwright (see Atlas MATTER-54 and MATTER-57); automating them in CI is a follow-up.
