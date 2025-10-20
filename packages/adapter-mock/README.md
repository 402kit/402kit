# @402kit/adapter-mock

Mock payment adapter for testing 402Kit integration without real payment processing.

## Installation

```bash
npm install @402kit/adapter-mock
# or
pnpm add @402kit/adapter-mock
```

## Quick Start

```typescript
import { MockAdapter } from '@402kit/adapter-mock';

const adapter = new MockAdapter();

// Generate a payment challenge
const challenge = await adapter.createChallenge({
  resource: '/api/premium',
  priceUsd: 0.01,
});

// Simulate payment (auto-succeeds)
const receipt = await adapter.pay(challenge);
```

## Features

- Instant payment simulation
- No external dependencies
- Perfect for testing and development
- Implements full PaymentAdapter interface

## Documentation

For complete documentation, examples, and guides, visit:

- [Main Documentation](https://github.com/402kit/402kit#readme)
- [Adapter Guide](https://github.com/402kit/402kit/tree/main/docs)

## License

Apache-2.0 - see [LICENSE](./LICENSE) for details.
