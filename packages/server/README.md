# @402kit/server

Server middleware for Express, Next.js, and Hono to handle HTTP 402 payment protection.

## Installation

```bash
npm install @402kit/server
# or
pnpm add @402kit/server
```

## Quick Start

### Express

```typescript
import express from 'express';
import { expressPaymentMiddleware } from '@402kit/server/express';
import { MockAdapter } from '@402kit/adapter-mock';

const app = express();

app.use(
  '/api/premium',
  expressPaymentMiddleware({
    adapter: new MockAdapter(),
    priceUsd: 0.01,
  })
);
```

### Next.js

```typescript
import { nextPaymentMiddleware } from '@402kit/server/next';

export default nextPaymentMiddleware(
  {
    adapter: new MockAdapter(),
    priceUsd: 0.01,
  },
  async (req, res) => {
    res.json({ data: 'premium content' });
  }
);
```

### Hono

```typescript
import { Hono } from 'hono';
import { honoPaymentMiddleware } from '@402kit/server/hono';

const app = new Hono();

app.use(
  '/api/premium',
  honoPaymentMiddleware({
    adapter: new MockAdapter(),
    priceUsd: 0.01,
  })
);
```

## Features

- Express, Next.js, and Hono support
- Configurable pricing
- Session-based entitlements
- Payment adapter integration

## Documentation

For complete documentation, examples, and guides, visit:

- [Main Documentation](https://github.com/402kit/402kit#readme)
- [Server Guide](https://github.com/402kit/402kit/tree/main/docs)

## License

Apache-2.0 - see [LICENSE](./LICENSE) for details.
