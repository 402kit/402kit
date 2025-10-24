# @402kit/server

Server middleware for HTTP 402/x402 (Express/Next.js/Hono/edge). Protect API routes with micropayments using the 402kit ecosystem and x402 protocol.

## Installation

```bash
npm install @402kit/server
```

## Quick Start

```typescript
import { handle402 } from '@402kit/server';
import { MockAdapter } from '@402kit/adapter-mock';

// HTTP 402 payment protection middleware
const config = {
  price: async () => ({
    scheme: 'exact',
    network: 'evm:base:sepolia',
    asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    maxAmountRequired: '1000',
  }),
  adapters: { mock: new MockAdapter() },
  defaultAdapter: 'mock',
};
```

## Features

- HTTP 402 Payment Required middleware
- x402 facilitator integration
- Express/Next.js/Hono/edge runtime support
- 402kit adapter ecosystem

## License

Apache-2.0
