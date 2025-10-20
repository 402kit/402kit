# Project Structure

```
/402kit
├── .changeset/              # Changesets for version management
├── .github/
│   ├── ISSUE_TEMPLATE/      # Bug, feature, question templates
│   ├── workflows/           # CI/CD workflows
│   ├── CODEOWNERS           # Code ownership
│   ├── FUNDING.yml          # Funding info
│   └── PULL_REQUEST_TEMPLATE.md
├── conformance/             # x402 conformance test suite
│   ├── scenarios/           # Test scenarios
│   └── package.json
├── docs/                    # Documentation
│   ├── GETTING_STARTED.md
│   ├── ARCHITECTURE.md
│   └── X402_SPEC.md
├── examples/                # Example applications
│   ├── express/             # Express.js server
│   ├── next/                # Next.js App Router
│   └── browser/             # Browser client
├── packages/                # Monorepo packages
│   ├── core/                # @402kit/core
│   │   ├── src/
│   │   │   ├── types.ts
│   │   │   ├── validation.ts
│   │   │   ├── codec.ts
│   │   │   ├── canonical.ts
│   │   │   ├── anti-replay.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── client/              # @402kit/client
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── server/              # @402kit/server
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── express.ts
│   │   │   ├── next.ts
│   │   │   └── hono.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── entitlement/         # @402kit/entitlement
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── adapter-mock/        # @402kit/adapter-mock
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── adapter-x402/        # @402kit/adapter-x402
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── RFCs/                    # Request for Comments
│   └── README.md
├── CHANGELOG.md             # Project changelog
├── CLA.md                   # Contributor License Agreement
├── CODE_OF_CONDUCT.md       # Community code of conduct
├── CODE_OF_PRACTICE.md      # Development practices
├── CONTRIBUTING.md          # Contribution guidelines
├── GOVERNANCE.md            # Project governance model
├── LICENSE                  # MIT License
├── MAINTAINERS.md           # Maintainer list
├── README.md                # Project overview
├── RELEASE.md               # Release process
├── ROADMAP.md               # Project roadmap
├── SECURITY.md              # Security policy
├── SECURITY_CONTACTS        # Security contact info
├── SUPPORT.md               # Support options
├── TRADEMARKS.md            # Trademark policy
├── package.json             # Root package.json
├── pnpm-workspace.yaml      # pnpm workspace config
├── tsconfig.base.json       # Base TypeScript config
├── vitest.config.ts         # Vitest config
├── .eslintrc.json           # ESLint config
├── .prettierrc.json         # Prettier config
└── .gitignore               # Git ignore rules
```

## Key Directories

### `/packages`

Monorepo packages using pnpm workspaces. Each package is independently publishable to NPM.

### `/examples`

Full working examples demonstrating 402Kit usage in different environments.

### `/conformance`

Test suite validating x402 protocol compliance and interoperability.

### `/docs`

Additional documentation beyond README.

### `/.github`

GitHub-specific files: issue templates, PR templates, workflows, governance.

### `/RFCs`

Proposals for significant changes to protocol or APIs.

## Package Dependencies

```
@402kit/client
  └─ @402kit/core

@402kit/server
  ├─ @402kit/core
  └─ @402kit/entitlement

@402kit/entitlement
  └─ @402kit/core

@402kit/adapter-mock
  └─ @402kit/core

@402kit/adapter-x402
  └─ @402kit/core
```

## Build Outputs

```
packages/*/dist/
  ├── index.js           # CommonJS
  ├── index.mjs          # ESM
  ├── index.d.ts         # TypeScript declarations
  └── *.map              # Source maps
```

## Development Workflow

1. Edit files in `packages/*/src/`
2. Run `pnpm build` to compile TypeScript
3. Run `pnpm test` to test
4. Run `pnpm lint` to check style
5. Create changeset with `pnpm changeset`
6. Submit PR

## Questions?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development setup.
