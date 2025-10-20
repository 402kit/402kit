# Conformance Test Suite

This directory contains conformance tests for x402 protocol compatibility.

## Overview

The conformance suite validates that 402Kit correctly implements the x402 specification.

## Test Scenarios

### Core Protocol

- [ ] Challenge format (exact/EVM)
- [ ] Payment header format
- [ ] Response header format
- [ ] Binding validation
- [ ] Amount validation (atomic units)
- [ ] Network ID validation
- [ ] Asset address validation

### Security

- [ ] Replay protection
- [ ] Timestamp validation
- [ ] Clock skew tolerance
- [ ] TLS requirement
- [ ] Nonce uniqueness

### Flow

- [ ] 402 → payment → 200 happy path
- [ ] 402 → invalid payment → 402 error
- [ ] 402 → expired challenge → 402 error
- [ ] 402 → insufficient amount → 402 error
- [ ] 402 → tampered binding → 402 error
- [ ] 402 → replay attempt → 409 error

### Adapters

- [ ] Mock adapter conformance
- [ ] x402 facilitator adapter conformance

### Middleware

- [ ] Express middleware conformance
- [ ] Next.js middleware conformance
- [ ] Hono middleware conformance

## Running Tests

```bash
# Run all conformance tests
pnpm --filter conformance test

# Run specific scenario
pnpm --filter conformance test:scenario happy-path
```

## Adding Tests

Create a new scenario file in `scenarios/`:

```typescript
export const scenario = {
  name: 'My Test Scenario',
  steps: [
    // Test steps
  ],
  expectations: [
    // Expected outcomes
  ],
};
```

## Interop Testing

For testing with other x402 implementations:

```bash
# Set facilitator URL
export X402_FACILITATOR_URL=https://facilitator.example.com

# Run interop tests
pnpm --filter conformance test:interop
```

## Reporting Issues

If a conformance test fails, open an issue with:

- Scenario name
- Expected behavior
- Actual behavior
- x402 spec reference
