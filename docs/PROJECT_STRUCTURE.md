# Project Structure

This document outlines the structure of the 402Kit monorepo.

```
/402kit
├── .github/                 # GitHub-specific files (workflows, templates)
├── assets/                  # Static assets
├── conformance/             # x402 conformance test suite
├── docs/                    # Documentation
├── examples/                # Example applications
├── packages/                # Monorepo packages
├── CHANGELOG.md             # Project changelog
├── CLA.md                   # Contributor License Agreement
├── CODEOWNERS               # Code ownership
├── CONTRIBUTING.md          # Contribution guidelines
├── LICENSE                  # Apache-2.0 License
├── NOTICE                   # Notice file for dependencies
├── README.md                # Project overview
├── SECURITY.md              # Security policy
├── TRADEMARKS.md            # Trademark policy
├── package.json             # Root package.json
├── pnpm-lock.yaml           # pnpm lockfile
├── pnpm-workspace.yaml      # pnpm workspace config
├── tsconfig.base.json       # Base TypeScript config
└── vitest.config.ts         # Vitest config
```

## Key Directories

### `/packages`

Monorepo packages using pnpm workspaces. Each package is independently publishable to npm.

- **`core`**: Core types, schemas, codecs, and validation logic.
- **`client`**: HTTP client with automatic 402 handling.
- **`server`**: Server middleware for Express, Next.js, and Hono.
- **`entitlement`**: Optional session and entitlement helpers.
- **`adapter-mock`**: Mock adapter for testing.
- **`adapter-x402`**: Adapter for integrating with an x402 facilitator.

### `/examples`

Full working examples demonstrating 402Kit usage in different environments (Next.js, Express, etc.).

### `/conformance`

A test suite for validating x402 protocol compliance and ensuring interoperability.

### `/docs`

Project documentation, including architecture, specifications, and guides.

## Development Workflow

1.  Edit files in `packages/*/src/`.
2.  Run `pnpm build` to compile TypeScript.
3.  Run `pnpm test` to run tests.
4.  Submit a Pull Request with your changes.

See [CONTRIBUTING.md](../CONTRIBUTING.md) for more details on the development setup.
