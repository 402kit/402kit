# Changesets

This directory contains changesets for version management.

## What are changesets?

Changesets are a way to manage versioning and changelogs with a focus on monorepos.

## Creating a changeset

```bash
pnpm changeset
```

Follow the prompts to:

1. Select packages that changed
2. Choose version bump type (major/minor/patch)
3. Describe the changes

## Consuming changesets

Maintainers will run:

```bash
pnpm version-packages
```

This consumes all changesets and updates package versions.

## Learn more

https://github.com/changesets/changesets
