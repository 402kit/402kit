# Release Process

This document describes the release process for 402Kit.

## Overview

We use [Changesets](https://github.com/changesets/changesets) for version management and publishing.

## Prerequisites

- Maintainer access
- NPM publishing rights
- GitHub release permissions

## Steps

### 1. Create Changesets

Contributors and maintainers create changesets for PRs:

```bash
pnpm changeset
```

Follow prompts to:
- Select packages affected
- Choose version bump (major, minor, patch)
- Describe changes

Commit the changeset file.

### 2. Version Bump

When ready to release:

```bash
pnpm version-packages
```

This:
- Consumes all changesets
- Updates package.json versions
- Updates CHANGELOG.md

Review changes and commit:

```bash
git add .
git commit -m "chore: version packages"
git push
```

### 3. Build and Test

```bash
# Clean
pnpm clean

# Install fresh dependencies
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test

# Lint and typecheck
pnpm lint
pnpm typecheck
```

### 4. Publish to NPM

```bash
pnpm release
```

This publishes all updated packages to NPM.

### 5. Create GitHub Release

1. Go to https://github.com/402kit/402kit/releases/new
2. Create new tag: `v0.x.x`
3. Title: `v0.x.x`
4. Copy relevant CHANGELOG entries to description
5. Attach any release artifacts
6. Publish release

### 6. Announce

- GitHub Discussions announcement
- Update README if needed
- Tweet/social media (optional)

## Release Schedule

- **Patch releases**: As needed for bug fixes
- **Minor releases**: Every 2-4 weeks
- **Major releases**: When breaking changes accumulate

## Pre-releases

For testing before stable release:

```bash
# Create pre-release version
pnpm changeset version --snapshot alpha

# Publish with tag
pnpm publish -r --tag alpha
```

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **Major (1.0.0)**: Breaking changes
- **Minor (0.1.0)**: New features, backward compatible
- **Patch (0.0.1)**: Bug fixes

## Rollback

If a release has critical issues:

```bash
# Deprecate the broken version
npm deprecate @402kit/package@x.x.x "Critical bug, use x.x.y"

# Publish hotfix as new patch version
```

## Questions?

Contact maintainers or open a Discussion.
