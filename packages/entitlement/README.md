# @402kit/entitlement

Entitlement helpers for granting/checking paid access. Session management for HTTP 402 and x402 protocol implementations in the 402kit ecosystem.

## Installation

```bash
npm install @402kit/entitlement
```

## Quick Start

```typescript
import { entitlement } from '@402kit/entitlement';

// Cookie-based entitlements for HTTP 402 flows
const cookieEnt = entitlement.cookie({ ttlSeconds: 3600 });

// Grant access after x402 payment
await cookieEnt.grant('urn:resource:123');

// Check entitlement in 402kit middleware
const hasAccess = await cookieEnt.check(cookieHeader, resource);
```

## Features

- HTTP 402 session management
- Cookie and bearer token entitlements
- 402kit middleware integration
- x402 protocol support

## License

Apache-2.0
