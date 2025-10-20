# @402kit/client

HTTP client with automatic 402 payment handling for seamless micropayment integration.

## Installation

```bash
npm install @402kit/client
# or
pnpm add @402kit/client
```

## Quick Start

```typescript
import { PaymentClient } from '@402kit/client';
import { MockAdapter } from '@402kit/adapter-mock';

const client = new PaymentClient({
  adapter: new MockAdapter(),
  onPaymentRequired: async (challenge) => {
    console.log('Payment needed:', challenge);
  },
});

const response = await client.fetch('https://api.example.com/premium');
```

## Features

- Automatic 402 response handling
- Payment adapter integration
- Session management
- TypeScript support

## Documentation

For complete documentation, examples, and guides, visit:

- [Main Documentation](https://github.com/402kit/402kit#readme)
- [Client Guide](https://github.com/402kit/402kit/tree/main/docs)

## License

Apache-2.0 - see [LICENSE](./LICENSE) for details.
