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
 * Generate random nonce (128-bit hex)
 */
export function generateNonce(): string {
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')
  ).join('');
}

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
