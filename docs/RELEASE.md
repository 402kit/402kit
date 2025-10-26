# Release Process

This document describes the release process for 402Kit, which is automated via GitHub Actions.

## Overview

Releases are driven by git tags. Pushing a new tag matching the pattern `v*.*.*` (e.g., `v1.0.1`) will trigger the release workflow.

The workflow will:

1.  Build all packages.
2.  Publish the updated packages to npm with provenance attestations.

**Note**: The release workflow does NOT automatically run tests or create GitHub Releases. Ensure CI is green on `main` before tagging.

## Prerequisites

- You must be a maintainer with permission to push to the repository.

## Steps to Release

### 1. Create a Changeset

Document what changed using the `changeset` tool:

```bash
pnpm changeset
```

Since we use **fixed versioning**, all `@402kit/*` packages will be released together at the same version, even if only one package changed.

The changeset will be stored in `.changeset/` and committed to the repository.

### 2. Version Packages

When ready to release, apply the changesets and bump all package versions:

```bash
pnpm changeset version
```

This will:

- Update all `@402kit/*` packages to the same new version
- Update the `VERSION` constant in `packages/core/src/index.ts`
- Generate/update `CHANGELOG.md` files for each package
- Delete consumed changesets

Review the changes and commit:

```bash
git add -A
git commit -m "chore: release vX.Y.Z"
```

### 3. Create and Push a Tag

Create a git tag matching the new version:

```bash
# Example for v0.1.3
git tag v0.1.3
git push origin main --tags
```

### 4. Monitor the Release Workflow

Go to the "Actions" tab in the GitHub repository to monitor the progress of the "Release" workflow. If any step fails, the release will be aborted.

### 4. Verify the Release

Once the workflow completes successfully:

- Check npm to ensure all `@402kit/*` packages are published at the same version
- Verify npm provenance attestations are present

## Manual Publishing (Emergency Only)

If the automated release process fails and a release is urgently needed, maintainers can publish manually. This should be avoided.

1.  Ensure your local `main` is clean and up-to-date.
2.  Run `pnpm install` and `pnpm build`.
3.  Log in to npm: `npm login`.
4.  Publish each public package: `pnpm publish -r --access public`.

## Versioning

We use **fixed/lockstep versioning** managed by [Changesets](https://github.com/changesets/changesets):

- **All `@402kit/*` packages share the same version number**
- Configured in `.changeset/config.json`: `"fixed": [["@402kit/*"]]`
- When any package changes, all packages bump together
- Simplifies dependency management and communication ("402kit v0.1.3")
- Package-specific CHANGELOGs show what actually changed in each package

Releases are tag-driven (`v*.*.*`), and the GitHub Actions workflow automatically publishes to npm with provenance attestations.
