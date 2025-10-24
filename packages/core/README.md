# @402kit/core

Core SDK for HTTP 402 (x402) payments and entitlements. Essential types, schemas, and utilities for building 402kit-powered applications with micropayment support.

## Installation

```bash
npm install @402kit/core
```

## Features

- HTTP 402 Payment Required protocol support
- x402 facilitator protocol implementation
- TypeScript types and Zod validation schemas
- 402kit ecosystem foundation
- Zero runtime dependencies

## Quick Start

```typescript
import { validateChallenge, encodeChallengeBody } from '@402kit/core';

// Validate HTTP 402 payment challenges
const isValid = validateChallenge(challenge);
```

## License

Apache-2.0
