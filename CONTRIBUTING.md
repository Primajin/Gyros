# Contributing to Gyros

## Commit conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Every commit message and PR title must follow the format:

```
<type>[optional scope][optional !]: <description>
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `deps`.

A `!` suffix or a `BREAKING CHANGE:` footer indicates a breaking change, which triggers a major version bump.

## Release process

Releases are fully automated and driven by [Release Please](https://github.com/googleapis/release-please):

1. Conventional commit messages on `main` are analysed by Release Please.
2. Release Please opens (or updates) a **Release PR** that bumps `package.json`, updates `CHANGELOG.md`, and sets the new version tag.
3. When the Release PR is merged, Release Please creates a **GitHub Release** and a version tag (e.g. `v1.2.3`).
4. The GitHub Release event triggers the **Publish to npm** workflow, which:
   - checks out the tagged commit,
   - installs dependencies with `npm ci`,
   - builds the package with `npm run build`,
   - publishes `@primajin/gyros` to npm with `--provenance` (linking the npm artifact to this repository and the exact workflow run).

### PR title linting

A workflow validates every PR title on open / edit to ensure it follows Conventional Commits. It also automatically promotes the PR title bump level to match the highest-level commit in the branch (e.g. if a commit in the branch is a `feat`, a `fix` PR title will be updated to `feat`).

## Trust and transparency

- The npm package is published exclusively by the **Publish to npm** GitHub Actions workflow — never from a local machine.
- npm [provenance](https://docs.npmjs.com/generating-provenance-statements) is enabled (`--provenance` flag). Each published version includes a signed SLSA provenance attestation that links the package back to:
  - the exact source commit in this repository,
  - the GitHub Actions workflow run that produced it.
- Consumers can verify provenance on the npm registry page for `@primajin/gyros` or via `npm audit signatures`.
- The `NPM_TOKEN` secret is scoped to GitHub Actions only (not available to Dependabot or Copilot agents).

## Package name

The package is published as **`@primajin/gyros`** (scoped under the [primajin](https://www.npmjs.com/~primajin) npm account) because the unscoped name `gyros` was already taken on the npm registry.
