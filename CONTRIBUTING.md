# Contributing to 402Kit

We welcome contributions from the community! Please follow these guidelines to ensure a smooth and effective process.

## Getting Started

Before you begin, please make sure you have the following installed:

- [Node.js](https://nodejs.org) (version 20 or higher)
- [pnpm](https://pnpm.io)

### Development Workflow

1.  **Fork and Clone**: Fork the repository and clone it to your local machine.
2.  **Install Dependencies**: Run `pnpm install` in the root of the monorepo. This will install all dependencies and link the local packages.
3.  **Build Packages**: Run `pnpm build` to compile all TypeScript packages.
4.  **Run Tests**: Run `pnpm test` to ensure everything is working as expected.

## Submitting a Pull Request (PR)

1.  **Create a Branch**: Create a new branch for your feature or bug fix.
2.  **Make Changes**: Implement your changes, ensuring you follow the project's coding style.
3.  **Add Tests**: Add or update tests for your changes. Run `pnpm -w test:conformance` to check for protocol conformance.
4.  **Commit Changes**: Use the [Conventional Commits](https://www.conventionalcommits.org/) format for your commit messages.
5.  **Push and Open PR**: Push your branch to your fork and open a pull request against the `main` branch.

A maintainer will review your PR. It needs at least one approving review and a passing CI build to be merged.

## Contributor License Agreement (CLA)

402Kit requires all contributors to sign a Contributor License Agreement (CLA). The CLA check will run automatically on your first PR.

**Note on Relicensing**: The CLA includes a clause granting the project maintainers the right to relicense contributions. This is intended to ensure the long-term flexibility and sustainability of the project. Please review [CLA.md](./CLA.md) for details.

For corporate contributions or questions about the CLA, please contact [enterprise@402kit.dev](mailto:enterprise@402kit.dev).

## License

By contributing, you agree that your contributions will be licensed under the Apache-2.0 License.
