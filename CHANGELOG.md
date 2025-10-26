# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security

- **Supply-chain guardrails (v2):**
  - Dependabot: Grouped updates with lockfile-only strategy (prod patches, dev minor+patch) - single entry due to Dependabot directory constraint
  - Dependency Review: Added PR comment summaries for visibility
  - Release workflow: Added pnpm cache, npm provenance attestations, repo guard, and concurrency control
  - Extended CODEOWNERS to require security team review for dependency/CI file changes
- Added Dependabot configuration for automated dependency updates (weekly npm + GitHub Actions)
- Added security headers to Next.js demo (CSP, X-Frame-Options, X-Content-Type-Options, CORP, COOP, Referrer-Policy, Permissions-Policy)
- Added edge middleware to block WordPress probe requests (`/wp-admin`, `/wp-login.php`, etc.)
- Added `.env.example` template with security warnings for environment variable handling
- Expanded security documentation in README.md with best practices and threat model reference
- Updated vuln-scan CI workflow documentation to clarify `continue-on-error` acceptance criteria

### Added

- Initial release of 402Kit
- Core package with x402.v1 protocol types and utilities
- Client package with automatic 402 handling
- Server package with Express, Next.js, and Hono middleware
- Entitlement package for session management
- Mock adapter for testing
- x402 facilitator adapter
- Express, Next.js, and browser examples
- Comprehensive documentation and governance files

### Changed

- N/A

### Deprecated

- N/A

### Removed

- N/A

### Fixed

- N/A

### Security

- N/A

## [0.1.0] - 2025-10-19

### Added

- Initial MVP release
- x402-compatible protocol implementation
- Core SDK packages
- Example applications
- Full documentation

---

**Note**: This changelog is maintained via [Changesets](https://github.com/changesets/changesets). Run `pnpm changeset` to add entries.
