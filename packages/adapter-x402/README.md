# @402kit/adapter-x402

Adapter for talking to x402 facilitators. Real HTTP 402 micropayment processing using the x402 protocol in the 402kit ecosystem.

## Installation

```bash
npm install @402kit/adapter-x402
```

## Quick Start

```typescript
import { X402Adapter } from '@402kit/adapter-x402';

// Connect to real x402 facilitators for HTTP 402 payments
const adapter = new X402Adapter({
  facilitatorUrl: 'https://facilitator.example.com',
});

// Use with 402kit ecosystem
const client = createClient({
  adapters: { x402: adapter },
  resolvePayment: async (challenge, ctx) => {
    return await ctx.getAdapter('x402').initiate(challenge, ctx);
  },
});
```

## Features

- x402 facilitator protocol support
- Real HTTP 402 micropayment processing
- 402kit ecosystem integration
- Production-ready payments

## License

Apache-2.0
