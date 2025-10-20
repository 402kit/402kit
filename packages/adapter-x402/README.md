# @402kit/adapter-x402

x402.v1 protocol facilitator adapter for real micropayment processing.

## Installation

```bash
npm install @402kit/adapter-x402
# or
pnpm add @402kit/adapter-x402
```

## Quick Start

```typescript
import { X402Adapter } from '@402kit/adapter-x402';

const adapter = new X402Adapter({
  facilitatorUrl: 'https://facilitator.example.com',
  merchantId: 'your-merchant-id',
});

// Generate a payment challenge
const challenge = await adapter.createChallenge({
  resource: '/api/premium',
  priceUsd: 0.01,
});

// Process payment via x402 facilitator
const receipt = await adapter.pay(challenge);
```

## Features

- x402.v1 protocol implementation
- Real payment processing
- Facilitator integration
- Full schema validation

## Documentation

For complete documentation, examples, and guides, visit:

- [Main Documentation](https://github.com/402kit/402kit#readme)
- [x402 Protocol Spec](https://github.com/402kit/402kit/tree/main/docs)

## License

Apache-2.0 - see [LICENSE](./LICENSE) for details.
