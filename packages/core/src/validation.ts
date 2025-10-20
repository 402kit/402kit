import { PaymentChallenge, PaymentHeader, PaymentResponse } from './types.js';

/**
 * Validate payment challenge schema
 */
export function validateChallenge(
  challenge: unknown
): challenge is PaymentChallenge {
  if (!challenge || typeof challenge !== 'object') return false;

  const c = challenge as Record<string, unknown>;

  // Required string fields
  if (
    typeof c['version'] !== 'string' ||
    typeof c['scheme'] !== 'string' ||
    typeof c['network'] !== 'string' ||
    typeof c['asset'] !== 'string' ||
    typeof c['payTo'] !== 'string' ||
    typeof c['maxAmountRequired'] !== 'string' ||
    typeof c['challengeId'] !== 'string' ||
    typeof c['resource'] !== 'string'
  ) {
    return false;
  }

  // Required number field
  if (typeof c['maxTimeoutSeconds'] !== 'number') return false;

  // Required binding object
  const bind = c['bind'];
  if (!bind || typeof bind !== 'object') return false;

  const b = bind as Record<string, unknown>;
  if (
    typeof b['host'] !== 'string' ||
    typeof b['method'] !== 'string' ||
    typeof b['path'] !== 'string'
  ) {
    return false;
  }

  // Validate amounts are strings (atomic units)
  if (!/^\d+$/.test(c['maxAmountRequired'] as string)) return false;

  // Validate Ethereum addresses (basic check)
  if (
    !/^0x[a-fA-F0-9]{40}$/.test(c['asset'] as string) ||
    !/^0x[a-fA-F0-9]{40}$/.test(c['payTo'] as string)
  ) {
    return false;
  }

  return true;
}

/**
 * Validate payment header schema
 */
export function validatePaymentHeader(
  header: unknown
): header is PaymentHeader {
  if (!header || typeof header !== 'object') return false;

  const h = header as Record<string, unknown>;

  // Required string fields
  if (
    typeof h['version'] !== 'string' ||
    typeof h['scheme'] !== 'string' ||
    typeof h['challengeId'] !== 'string' ||
    typeof h['network'] !== 'string' ||
    typeof h['asset'] !== 'string' ||
    typeof h['paidAmount'] !== 'string' ||
    typeof h['issuedAt'] !== 'string' ||
    typeof h['nonce'] !== 'string'
  ) {
    return false;
  }

  // Validate amounts are strings (atomic units)
  if (!/^\d+$/.test(h['paidAmount'] as string)) return false;

  // Validate Ethereum address
  if (!/^0x[a-fA-F0-9]{40}$/.test(h['asset'] as string)) return false;

  // Validate optional payer address
  if (
    h['payer'] !== undefined &&
    !/^0x[a-fA-F0-9]{40}$/.test(h['payer'] as string)
  ) {
    return false;
  }

  // Validate ISO-8601 timestamp (basic check)
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(h['issuedAt'] as string)) {
    return false;
  }

  // Required proof object
  const proof = h['proof'];
  if (!proof || typeof proof !== 'object') return false;

  const p = proof as Record<string, unknown>;
  if (typeof p['type'] !== 'string') return false;

  return true;
}

/**
 * Validate payment response schema
 */
export function validatePaymentResponse(
  response: unknown
): response is PaymentResponse {
  if (!response || typeof response !== 'object') return false;

  const r = response as Record<string, unknown>;

  if (
    typeof r['ok'] !== 'boolean' ||
    typeof r['challengeId'] !== 'string' ||
    typeof r['resource'] !== 'string'
  ) {
    return false;
  }

  return true;
}

/**
 * Validate atomic amount format
 */
export function validateAtomicAmount(amount: string): boolean {
  return /^\d+$/.test(amount);
}

/**
 * Validate Ethereum address (checksum-aware)
 */
export function validateEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate network ID format
 */
export function validateNetworkId(networkId: string): boolean {
  // Format: <chain>:<network>:<environment>
  const parts = networkId.split(':');
  return parts.length === 3 && parts.every((p) => p.length > 0);
}
