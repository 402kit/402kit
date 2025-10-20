# @402kit/entitlement

Session and entitlement management helpers for 402Kit payment flows.

## Installation

```bash
npm install @402kit/entitlement
# or
pnpm add @402kit/entitlement
```

## Quick Start

```typescript
import { SessionEntitlements } from '@402kit/entitlement';

const entitlements = new SessionEntitlements();

// Grant entitlement after payment
entitlements.grant(sessionId, resourcePath);

// Check entitlement
if (entitlements.hasEntitlement(sessionId, resourcePath)) {
  // Allow access
}
```

## Features

- In-memory session tracking
- Resource-level entitlements
- Simple grant/revoke API
- TypeScript support

## Documentation

For complete documentation, examples, and guides, visit:

- [Main Documentation](https://github.com/402kit/402kit#readme)
- [Entitlement Guide](https://github.com/402kit/402kit/tree/main/docs)

## License

Apache-2.0 - see [LICENSE](./LICENSE) for details.
