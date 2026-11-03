# Releasing Matter

Registry: npmjs.com (public), scope `@interstellarforge`, MIT, published with provenance (ADR-010). Reason: the packages must be installable without any token or `.npmrc` (Atlas is open source; GitHub Packages requires authentication even for public packages). Tooling: Changesets. All `@interstellarforge/matter-*` packages share one version (`fixed` group in `.changeset/config.json`), so the compatibility matrix has a single axis.

## Versioning policy

- **0.x (until v1):** a breaking change bumps the minor, features and fixes bump the patch. Every breaking change names its migration in the changeset text.
- **From 1.0:** strict semver. Breaking = removed or renamed token, CSS variable, selector, attribute, export or component prop, or a changed default (theme, density, colour mode).
- Token renames count as breaking; add the new name first and keep the old one as an alias for the deprecation window.
- The initial release is `0.1.0`. No stability claims before 1.0.

## Flow

1. Every PR that changes published behaviour adds a changeset: `pnpm changeset` (use `--empty` for docs/CI-only changes).
2. CI (`ci.yml`): format, typecheck, lint, build, test, size budget must pass.
3. On merge to `main`, `release.yml` (changesets/action) opens or updates a "Version Packages" PR (versions + CHANGELOG).
4. Merging that PR runs `pnpm release` (`pnpm build && changeset publish`) and publishes to npmjs.com with provenance (`NPM_CONFIG_PROVENANCE=true` in `release.yml`; v0.1.0 was published locally without it). After a release, `npm audit signatures` must list attestations for `@interstellarforge/matter-*`. Publishing needs the repository secret `NPM_TOKEN` (npm automation token) or, preferably, npm trusted publishing for this repository and workflow.
5. Consumers pin the exact version and need no `.npmrc` or token; installs work like any public npm package.

## Release checklist (v0.1.0 and later)

- [ ] Both pilots (Atlas, Pulsar) accepted for this version (v0.1.0 only)
- [ ] `pnpm format && pnpm typecheck && pnpm lint && pnpm build && pnpm test && pnpm check:size` green
- [ ] `pnpm pack --dry-run` in each package lists only `dist/`, `tokens/` (or `dist/`), `README.md`, `package.json`
- [ ] Changelog states breaking changes and migrations; known limitations are listed
- [ ] Compatibility matrix below updated
- [ ] Docs and examples match the released API

## Compatibility matrix

Only combinations that were actually verified are listed.

| Matter           | Node (build) | Browsers verified                                               | Consumers verified                                                          |
| ---------------- | ------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 0.x (unreleased) | 24           | Chromium (Playwright): theme, colour mode and density switching | none yet (Atlas pilot, Pulsar pilot and the Next/SvelteKit demos are M3/M4) |

Requirements the CSS places on browsers: cascade layers (`@layer`) and `:not()` with attribute selectors. Verify the supported browser versions against current MDN data before stating them here.

## Rollback

- A published version is never overwritten. Fix forward with a patch release.
- A bad release: publish a fixed patch, then deprecate the bad version (`npm deprecate @interstellarforge/matter-tokens@<version> "<reason, use <fixed version>>"`). Delete a version only when it leaks a secret or breaks installs for everyone, and only within npm's unpublish window (72 hours after publish); otherwise deprecate.
- Consumers roll back by pinning the previous exact version.

## Deprecation policy

- Deprecated tokens, props and exports keep working for at least one minor release (0.x) or two minor releases / three months (from 1.0), whichever is longer.
- A deprecation is announced in the changeset and the docs, and has a dated removal target.
- Removal is a breaking change and follows the versioning policy above.

## Local publishing

Do not publish from a laptop. Every package pins `publishConfig.registry` to `https://registry.npmjs.org/` so an accidental `pnpm publish` can never go to a private default registry configured in someone's `~/.npmrc`; real releases only run in CI.

## Open

- License: MIT (decided 2026-11-02); `license` field and LICENSE file are in every package.
- Create the npm organisation/scope `@interstellarforge` and the `NPM_TOKEN` secret (or trusted publishing) before the first release. Scope availability was not verifiable from the build environment.
- Package names `@interstellarforge/matter-*` are unpublished; first publish is v0.1.0 (MATTER-67).
