# x402 Protocol Specification Compatibility

402Kit implements the **x402.v1** specification for HTTP 402 "Payment Required".

## Specification Overview

x402 defines a standard flow for micro-payments over HTTP:

1. Client requests protected resource
2. Server responds 402 with JSON challenge in body
3. Client resolves payment and retries with `X-PAYMENT` header
4. Server verifies payment and grants access

## Compliance

### ✅ Implemented

- **x402.v1 version identifier**
- **exact scheme** (one-time payment)
- **EVM network support** (Base, Polygon, etc.)
- **ERC-20 assets** (USDC, etc.)
- **Atomic unit amounts** (string format)
- **Binding** to request context
- **Challenge/response flow**
- **Base64url encoding** for headers
- **Anti-replay protection**
- **Clock skew tolerance**
- **Resource entitlement**

### 🚧 Partial / Future

- **upto scheme** (metering) - API defined, impl pending
- **Lightning Network** - via custom adapter
- **On-chain verification** - via custom adapter
- **Refunds** - planned for v0.4+
- **Subscriptions** - planned for v0.4+

## Specification Alignment

### Challenge Format (402 Body)

```json
{
  "version": "x402.v1",
  "scheme": "exact",
  "network": "evm:base:sepolia",
  "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  "payTo": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "maxAmountRequired": "1000",
  "maxTimeoutSeconds": 60,
  "challengeId": "uuid",
  "bind": {
    "host": "api.example.com",
    "method": "GET",
    "path": "/api/protected",
    "bodySha256": null
  },
  "resource": "urn:res:abc123",
  "meta": { "description": "One-off access" }
}
```

**402Kit**: Fully compliant.

### Payment Header (X-PAYMENT)

```
X-PAYMENT: base64url({
  "version": "x402.v1",
  "scheme": "exact",
  "challengeId": "uuid",
  "network": "evm:base:sepolia",
  "asset": "0x036CbD...",
  "paidAmount": "1000",
  "issuedAt": "2025-10-19T12:00:00Z",
  "nonce": "random-128bit",
  "proof": { "type": "facilitator", ... }
})
```

**402Kit**: Fully compliant.

### Response Header (X-PAYMENT-RESPONSE)

```
X-PAYMENT-RESPONSE: base64url({
  "ok": true,
  "challengeId": "uuid",
  "resource": "urn:res:abc123",
  "entitlement": { "type": "cookie", "ttlSeconds": 3600 }
})
```

**402Kit**: Fully compliant.

## Error Codes

| Status | Code              | Meaning                      |
| ------ | ----------------- | ---------------------------- |
| 402    | `expired`         | Challenge or payment expired |
| 402    | `insufficient`    | Amount too low               |
| 402    | `mismatch`        | Asset/network mismatch       |
| 409    | `replay`          | Payment already used         |
| 400    | `invalid_schema`  | Malformed payment header     |
| 400    | `invalid_binding` | Request binding mismatch     |

**402Kit**: Fully compliant.

## Interoperability

### With Reference Implementations

402Kit aims for 100% interop with:

- x402 reference client (if available)
- x402 reference server (if available)
- x402 facilitators

**Testing**: See [conformance test suite](../conformance/).

### With Facilitators

402Kit's x402 adapter integrates with facilitators that implement:

- `POST /initiate` - Returns ticket
- `POST /verify` - Verifies payment
- `POST /settle` - Settles payment (optional)

## Deviations (None)

402Kit strictly follows x402.v1 with no intentional deviations.

## Versioning

- **x402.v1**: Current implementation
- **Future versions**: Will be supported via version negotiation

## Contributing to x402 Spec

To propose changes to x402:

1. Open RFC in 402Kit repo (if SDK-related)
2. Engage with x402 working group (if spec-related)
3. Implement behind feature flag
4. Wait for spec approval

## References

- x402 Specification: (To be published)
- x402 GitHub: (To be published)
- 402Kit Conformance: [conformance/](../conformance/)

## Questions?

Open an issue or discussion about x402 compatibility.
