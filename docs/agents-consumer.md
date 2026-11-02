# AGENTS.md snippet for apps that use Matter

Paste into the app's `AGENTS.md`:

```md
## Matter design system

- UI uses `@interstellarforge/matter-react` or `-svelte`, plus `@interstellarforge/matter-css` (`matter.css`). Use existing components before writing custom ones.
- Colours, spacing, radii come from `--m-*` tokens; never hardcode them.
- Set `data-theme`, `data-color-mode` and `data-density` on `<html>`. Prevent the theme flash with `theme-init.js` (strict CSP) or `themeInitScript`.
- App CSS that is unlayered beats Matter's layered CSS: put element-level rules in a layer declared before `matter.components`.
- Need a missing component? Check Matter's backlog (Atlas project MATTER) before building it locally; generic ones belong in Matter.
- UI text goes through the app's localization files; Matter components take text via props.
```
