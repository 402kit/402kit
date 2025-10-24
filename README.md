# 402Kit — x402-Compatible SDK for HTTP 402 "Payment Required"

[![CI](https://github.com/402kit/402kit/workflows/ci/badge.svg)](https://github.com/402kit/402kit/actions)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![npm version](https://badge.fury.io/js/%40402kit%2Fcore.svg)](https://www.npmjs.com/package/@402kit/core)
[![x402 Compatible](https://img.shields.io/badge/x402-compatible-green.svg)](https://github.com/protocols/x402)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Security](https://img.shields.io/badge/security-policy-yellow.svg)](SECURITY.md)

> ⚡ **Monetize your APIs with HTTP 402 Payment Required** — Open source, protocol-first, production-ready.

[🎮 **Try Live Demo**](https://402kit.dev) • [🚀 Quick Start](#quick-start) • [📖 Documentation](docs/GETTING_STARTED.md) • [🛡️ Security](#security) • [🤝 Sponsor](#-sponsor-this-project)

---

**Love 402Kit?** Give us a ⭐ on GitHub to help the project grow!

## Problem

HTTP 402 exists, but practical, secure, and interoperable use is rare. Developers reinvent ad-hoc flows and cannot interoperate.

## Solution

402Kit implements an **x402-compatible** flow: a 402 response returns a JSON challenge in the body; the client retries with an `X-PAYMENT` header. The SDK offers client wrappers, server/edge middleware, and pluggable verification adapters (x402 facilitator, mock).

It lets any API say:
**"This resource costs X (in atomic units) — pay and retry."**

## Features

- ✅ **x402.v1 protocol compatible** — Full support for exact/EVM scheme
- ✅ **Security built-in** — Anti-replay, binding validation, TTL enforcement
- **fetch()/axios wrapper** with automatic 402 handling and retry
- **Middleware** for Express, Next.js, and Hono/Workers (Edge)
- **Pluggable adapters** (x402 facilitator, mock)
- **Optional entitlement helper** (avoid paying twice for the same resource)
- **Apache-2.0 licensed** with explicit patent grants

## Quick Start

### Install

```bash
pnpm add @402kit/client @402kit/server @402kit/adapter-x402 @402kit/adapter-mock
```

### Client

```typescript
import { createClient } from '@402kit/client';
import { x402Adapter } from '@402kit/adapter-x402';

const client = createClient({
  adapters: {
    x402: x402Adapter({ verifyUrl: 'https://facilitator.example.com/verify' }),
  },
  resolvePayment: (challenge, ctx) =>
    ctx.getAdapter('x402').initiate(challenge, ctx),
});

const res = await client.fetch('/api/protected');
console.log(await res.json());
```

### Server (Express)

```typescript
import express from 'express';
import { express402 } from '@402kit/server';
import { x402Adapter } from '@402kit/adapter-x402';

const app = express();

app.get(
  '/api/protected',
  express402({
    price: async () => ({
      scheme: 'exact',
      network: 'evm:base:sepolia',
      asset: '0xUSDC…',
      maxAmountRequired: '1000',
      description: 'One-off access',
    }),
    adapters: { x402: x402Adapter({ verifyUrl: process.env.VERIFY_URL! }) },
  }),
  (req, res) => res.json({ secret: 'value' })
);

app.listen(3000);
```

## Protocol Summary

| Direction       | Carrier                             | Schema            |
| --------------- | ----------------------------------- | ----------------- |
| server → client | 402 body (JSON)                     | x402.v1 challenge |
| client → server | `X-PAYMENT` header (base64url JSON) | x402.v1 payment   |
| server → client | `X-PAYMENT-RESPONSE` (optional)     | receipt/telemetry |

## Security

- **TLS only**
- **Atomic units as strings** (no floats)
- **Binding** to host/method/path (+ body hash if needed)
- **Short TTL**, single-use `challengeId`, nonce, replay protection
- **Strict error model**

## Sessions (Optional)

Use the entitlement helper to grant short-lived access for the same resource (cookie or bearer), so clients don't pay twice.

## Compatibility

402Kit defaults to **x402 exact/EVM** and aims for interop with reference middleware/fetch implementations. See `/conformance`.

## Packages

- **[@402kit/core](./packages/core)** - Core types, schemas, codecs, utilities
- **[@402kit/client](./packages/client)** - HTTP client with automatic 402 handling
- **[@402kit/server](./packages/server)** - Server middleware (Express, Next.js, Hono)
- **[@402kit/entitlement](./packages/entitlement)** - Session and entitlement helpers
- **[@402kit/adapter-mock](./packages/adapter-mock)** - Mock adapter for testing
- **[@402kit/adapter-x402](./packages/adapter-x402)** - x402 facilitator adapter

## Examples

- **[Browser Demo](https://402kit.dev)** 🎮 - **Live interactive demo** - Try the payment flow in your browser!
- **[Express](./examples/express)** - Express.js server
- **[Next.js](./examples/next)** - Next.js App Router
- **[Browser Source](./examples/browser)** - Browser client demo source code

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Format
pnpm format
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 💖 Sponsor This Project

402Kit is **free and open source** (Apache-2.0 licensed). If you're using it in production or find it valuable, please consider sponsoring to support continued development!

### Why Sponsor?

- ✅ Ensures long-term maintenance and security updates
- ✅ Funds new features and improvements
- ✅ Supports the open-source ecosystem
- ✅ Get your logo on our README (Gold+ sponsors)

### Sponsorship Tiers

| Tier            | Amount/Month | Benefits                         |
| --------------- | ------------ | -------------------------------- |
| 🥉 **Bronze**   | $100         | Listed as sponsor                |
| 🥈 **Silver**   | $500         | Logo in README + priority issues |
| 🥇 **Gold**     | $2,000       | Above + roadmap input            |
| 💎 **Platinum** | $5,000       | Above + quarterly strategy calls |

**[Become a Sponsor →](#)** (GitHub Sponsors link)

### Current Sponsors

_Be the first to sponsor 402Kit!_

---

## 🏢 Enterprise

Need custom features, support, or consulting? Check out [MONETIZATION.md](./MONETIZATION.md) for:

- 🔥 Hosted facilitator service (turnkey payment infrastructure)
- ⚡ Premium adapters for production
- 🎯 Enterprise support contracts
- 🛠️ Custom development and consulting

**[Contact us for enterprise →](#)** enterprise@402kit.dev

---

## Governance

See [docs/GOVERNANCE.md](docs/GOVERNANCE.md) for project governance model.

## Security

**Report vulnerabilities to**: security@402kit.dev

- ✅ **Anti-replay protection**: Single-use challenges with nonce tracking
- ✅ **Binding validation**: Payments bound to host/method/path
- ✅ **TTL enforcement**: Short-lived challenges (default 60s)
- ✅ **TLS required**: Always use HTTPS in production

See [SECURITY.md](./SECURITY.md) for full security policy and reporting procedures.

## License

Apache-2.0 © 2025 402Kit Authors

This project includes explicit **patent grants** under Apache License 2.0, protecting both contributors and users.

See [LICENSE](./LICENSE) and [NOTICE](./NOTICE) for details.

## Contributing

We welcome contributions! **All PRs require signing our CLA** ([CLA.md](./CLA.md)).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Trademark

"402Kit" is a trademark of the maintainer. See [TRADEMARKS.md](./TRADEMARKS.md) for usage guidelines.

## Support

See [.github/SUPPORT.md](.github/SUPPORT.md) for support options.

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for planned features and milestones.
