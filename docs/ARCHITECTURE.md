# Architecture

## Overview

402Kit is designed as a modular, pluggable SDK for HTTP 402 "Payment Required" workflows.

## Layers

### 1. Core (`@402kit/core`)

**Purpose**: Protocol primitives and utilities

**Exports**:

- Type definitions (Challenge, PaymentHeader, etc.)
- Validation functions
- Codecs (JSON, base64url)
- Canonicalization (binding, payment)
- Anti-replay protection

**No runtime dependencies** - pure utilities.

### 2. Adapters

**Purpose**: Payment resolution and verification

**Types**:

- `@402kit/adapter-mock` - Deterministic testing
- `@402kit/adapter-x402` - x402 facilitator integration
- Custom adapters (Lightning, on-chain, etc.)

**Interface**:

```typescript
interface PaymentAdapter {
  name: string;
  initiate(challenge, ctx): Promise<PaymentHeader>;
  verify(header, ctx): Promise<VerificationResult>;
  settle?(header, ctx): Promise<void>; // optional
}
```

### 3. Client (`@402kit/client`)

**Purpose**: Automatic 402 handling for fetch/axios

**Flow**:

1. Intercept 402 responses
2. Parse challenge from body
3. Resolve payment via adapter
4. Retry with `X-PAYMENT` header

**Features**:

- Configurable retry policy
- Hooks (onPaymentRequired, onVerified)
- Multi-adapter support

### 4. Server (`@402kit/server`)

**Purpose**: Middleware for Express, Next.js, Hono

**Flow**:

1. Check for entitlement (optional)
2. If no payment header → send 402 challenge
3. If payment header → verify via adapter
4. If valid → grant entitlement, allow request
5. If invalid → send error

**Features**:

- Pluggable adapters
- Entitlement support
- Configurable policies

### 5. Entitlement (`@402kit/entitlement`)

**Purpose**: Session management to avoid repeated payments

**Types**:

- Cookie-based (Set-Cookie header)
- Bearer token (X-PAYMENT-TOKEN header)
- Custom (function-based)

**Store interface** - in-memory default, Redis for production.

## Data Flow

```
┌─────────┐                    ┌─────────┐
│ Client  │                    │ Server  │
└────┬────┘                    └────┬────┘
     │                              │
     │ GET /api/protected           │
     ├─────────────────────────────>│
     │                              │
     │         402 + Challenge      │
     │<─────────────────────────────┤
     │                              │
     │  ┌──────────────┐            │
     │  │ Resolve      │            │
     │  │ Payment via  │            │
     │  │ Adapter      │            │
     │  └──────────────┘            │
     │                              │
     │ GET /api/protected           │
     │ X-PAYMENT: ...               │
     ├─────────────────────────────>│
     │                              │
     │                    ┌────────────┐
     │                    │ Verify via │
     │                    │ Adapter    │
     │                    └────────────┘
     │                              │
     │ 200 + Data                   │
     │ X-PAYMENT-RESPONSE: ...      │
     │<─────────────────────────────┤
     │                              │
```

## Security Architecture

### Anti-Replay

- **Store**: `(challengeId, nonce)` pairs with TTL
- **Check**: Before verification
- **Production**: Use Redis or distributed store

### Binding

- **Challenge**: Bound to (host, method, path, bodySha256?)
- **Verification**: Must match original request
- **Tampering**: Detected and rejected

### Clock Skew

- **Tolerance**: ±60s default
- **Check**: Before verification
- **Recommendation**: NTP for server clocks

## Extensibility

### Custom Adapters

Implement `PaymentAdapter` interface:

```typescript
export class MyAdapter implements PaymentAdapter {
  name = 'my-adapter';

  async initiate(challenge, ctx) {
    // Resolve payment
    return paymentHeader;
  }

  async verify(header, ctx) {
    // Verify payment
    return { ok: true, resource: '...' };
  }
}
```

### Custom Entitlement

Provide function or implement store interface:

```typescript
const grantEntitlement = async (resource: string) => {
  const token = await generateToken(resource);
  return token;
};
```

## Performance

- **Minimal overhead**: Single header check + adapter call
- **Caching**: Entitlement reduces repeat payments
- **Non-blocking**: Async verification
- **Replay store**: O(1) lookups with TTL cleanup

## Production Considerations

1. **Distributed replay store** (Redis)
2. **Adapter timeouts** and retries
3. **Monitoring** payment success rates
4. **Rate limiting** at edge
5. **TLS termination** at load balancer
6. **Adapter failover** for availability

## Questions?

See [SUPPORT.md](../SUPPORT.md) or open a Discussion.
