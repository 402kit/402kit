# @402kit/adapter-mock

Mock x402 facilitator for local dev and tests. Simulate HTTP 402 payment flows without real transactions in the 402kit ecosystem.

## Installation

```bash
npm install @402kit/adapter-mock
```

## Quick Start

```typescript
import { MockAdapter } from '@402kit/adapter-mock';

// Mock x402 facilitator for testing HTTP 402 flows
const adapter = new MockAdapter();

// Use with 402kit client/server
const client = createClient({
  adapters: { mock: adapter },
  resolvePayment: async (challenge, ctx) => {
    return await ctx.getAdapter('mock').initiate(challenge, ctx);
  },
});
```

## Features

- Mock x402 facilitator implementation
- HTTP 402 testing without real payments
- 402kit ecosystem integration
- Development and testing support

## License

Apache-2.0
