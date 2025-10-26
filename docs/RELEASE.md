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

### 1. Determine the Next Version

Follow [Semantic Versioning](https://semver.org/). Check the recent commits since the last tag to determine if the release should be a `major`, `minor`, or `patch` update.

### 2. Create and Push a New Tag

From your local, up-to-date `main` branch:

```bash
# Example for a patch release
git tag v1.0.1
git push origin v1.0.1
```

### 3. Monitor the Release Workflow

Go to the "Actions" tab in the GitHub repository to monitor the progress of the "Release" workflow. If any step fails, the release will be aborted.

### 4. Verify the Release

Once the workflow completes successfully:

- Check npm to ensure the new package versions are available.
- Check the GitHub Releases page to see the new release and its changelog.

## Manual Publishing (Emergency Only)

If the automated release process fails and a release is urgently needed, maintainers can publish manually. This should be avoided.

1.  Ensure your local `main` is clean and up-to-date.
2.  Run `pnpm install` and `pnpm build`.
3.  Log in to npm: `npm login`.
4.  Publish each public package: `pnpm publish -r --access public`.

## Versioning

We use tag-driven releases, but individual package versions are managed by `pnpm`. For now, version bumps are done manually in each `package.json`. In the future, we may adopt a tool like `changesets` to automate this.
