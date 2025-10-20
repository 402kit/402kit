# Getting Started with 402Kit

## Installation

```bash
pnpm add @402kit/client @402kit/server @402kit/adapter-mock
```

## Quick Start: Server

Create a protected API endpoint with Express:

```typescript
import express from 'express';
import { express402 } from '@402kit/server';
import { mockAdapter } from '@402kit/adapter-mock';

const app = express();

app.get(
  '/api/protected',
  express402({
    price: async () => ({
      scheme: 'exact',
      network: 'evm:base:sepolia',
      asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC
      maxAmountRequired: '1000', // 0.001 USDC (6 decimals)
      description: 'Access to protected resource',
    }),
    adapters: { mock: mockAdapter() },
  }),
  (req, res) => {
    res.json({ secret: 'Protected data!' });
  }
);

app.listen(3000);
```

## Quick Start: Client

Automatically handle 402 responses:

```typescript
import { createClient } from '@402kit/client';
import { mockAdapter } from '@402kit/adapter-mock';

const client = createClient({
  adapters: { mock: mockAdapter() },
  resolvePayment: (challenge, ctx) =>
    ctx.getAdapter('mock').initiate(challenge, ctx),
});

// Automatically handles 402 and retries
const res = await client.fetch('http://localhost:3000/api/protected');
const data = await res.json();
console.log(data); // { secret: 'Protected data!' }
```

## Concepts

### Challenge (402 Response)

When a protected resource is accessed, the server responds with:

- **Status**: 402 Payment Required
- **Body**: JSON challenge with payment details

```json
{
  "version": "x402.v1",
  "scheme": "exact",
  "network": "evm:base:sepolia",
  "asset": "0x036CbD...",
  "maxAmountRequired": "1000",
  "challengeId": "uuid...",
  "bind": {
    "host": "api.example.com",
    "method": "GET",
    "path": "/api/protected"
  },
  "resource": "urn:res:protected"
}
```

### Payment Header

The client resolves payment and retries with:

- **Header**: `X-PAYMENT: base64url(JSON)`
- **Payload**: Payment proof from adapter

### Adapters

Adapters handle payment resolution and verification:

- **mock**: Deterministic for testing
- **x402**: Facilitator integration
- **custom**: Implement your own

## Next Steps

- See [Examples](./examples) for complete applications
- Read [API Documentation](./docs) for detailed reference
- Check [Security](./SECURITY.md) for best practices
- Join [Discussions](https://github.com/402kit/402kit/discussions) for help
