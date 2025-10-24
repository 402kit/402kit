# @402kit/client

Client utilities to handle HTTP 402/x402 retries (X-PAYMENT). Seamless micropayment integration for browser and Node.js applications using the 402kit ecosystem.

## Installation

```bash
npm install @402kit/client
```

## Quick Start

```typescript
import { createClient } from '@402kit/client';
import { MockAdapter } from '@402kit/adapter-mock';

const client = createClient({
  adapters: { mock: new MockAdapter() },
  resolvePayment: async (challenge, ctx) => {
    return await ctx.getAdapter('mock').initiate(challenge, ctx);
  },
});
```

## Features

- Automatic HTTP 402 retry handling
- x402 protocol support
- 402kit adapter integration
- Browser and Node.js compatible

## License

Apache-2.0
