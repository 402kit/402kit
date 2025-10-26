import { PaymentHeader, ResourceBinding } from './types';

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof (globalThis as any).window !== 'undefined';

/**
 * Create canonical string for resource binding
 */
export function canonicalizeBinding(binding: ResourceBinding): string {
  const parts = [
    binding.method.toUpperCase(),
    binding.host.toLowerCase(),
    binding.path,
  ];

  if (binding.bodySha256) {
    parts.push(binding.bodySha256);
  }

  return parts.join('\n');
}

/**
 * Create canonical string for payment verification
 */
export function canonicalizePayment(header: PaymentHeader): string {
  const parts = [
    header.version,
    header.scheme,
    header.challengeId,
    header.network,
    header.asset.toLowerCase(),
    header.paidAmount,
    header.issuedAt,
    header.nonce,
  ];

  if (header.payer) {
    parts.push(header.payer.toLowerCase());
  }

  return parts.join('\n');
}

/**
 * Compute SHA-256 hash of a string (async for browser compatibility)
 */
export async function sha256(data: string): Promise<string> {
  if (isBrowser) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js environment
    const { createHash } = await import('crypto');
    return createHash('sha256').update(data, 'utf-8').digest('hex');
  }
}

/**
 * Compute SHA-256 hash of request body (async for browser compatibility)
 */
export async function hashBody(body: string | ArrayBuffer): Promise<string> {
  if (isBrowser) {
    const dataBuffer =
      typeof body === 'string'
        ? new TextEncoder().encode(body)
        : new Uint8Array(body);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js environment
    const { createHash } = await import('crypto');
    return createHash('sha256')
      .update(body as any)
      .digest('hex');
  }
}

/**
 * Generate cryptographically secure random nonce (128-bit, base64url-encoded)
 * Uses Web Crypto API (browser/edge) or Node.js crypto module
 */
export function generateNonce(): string {
  const bytes = new Uint8Array(16); // 128 bits

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Web Crypto API (browser/edge/modern Node)
    crypto.getRandomValues(bytes);
  } else {
    // Fallback for older Node.js (should not happen in modern environments)
    // This branch is only for extreme edge cases
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeCrypto = require('crypto');
    nodeCrypto.randomFillSync(bytes);
  }

  // Convert to base64url (URL-safe, no padding)
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate cryptographically secure UUID v4
 * Uses Web Crypto API (browser/edge) or Node.js crypto module
 */
export function generateUUID(): string {
  const bytes = new Uint8Array(16);

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Web Crypto API (browser/edge/modern Node)
    crypto.getRandomValues(bytes);
  } else {
    // Fallback for older Node.js
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeCrypto = require('crypto');
    nodeCrypto.randomFillSync(bytes);
  }

  // Set version (4) and variant bits per RFC 4122
  bytes[6]! = (bytes[6]! & 0x0f) | 0x40; // Version 4
  bytes[8]! = (bytes[8]! & 0x3f) | 0x80; // Variant 10

  // Format as UUID string
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(
    ''
  );
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
