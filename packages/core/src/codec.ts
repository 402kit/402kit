import { PaymentChallenge, PaymentHeader } from './types';

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof (globalThis as any).window !== 'undefined';

/**
 * Browser-compatible base64 encode
 */
function base64EncodeBrowser(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Browser-compatible base64 decode
 */
function base64DecodeBrowser(str: string): string {
  return decodeURIComponent(escape(atob(str)));
}

/**
 * Node.js base64 encode
 */
function base64EncodeNode(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64');
}

/**
 * Node.js base64 decode
 */
function base64DecodeNode(str: string): string {
  return Buffer.from(str, 'base64').toString('utf-8');
}

/**
 * Universal base64 encode
 */
function base64Encode(str: string): string {
  return isBrowser ? base64EncodeBrowser(str) : base64EncodeNode(str);
}

/**
 * Universal base64 decode
 */
function base64Decode(str: string): string {
  return isBrowser ? base64DecodeBrowser(str) : base64DecodeNode(str);
}

/**
 * Encode payment header as base64url JSON
 */
export function encodePaymentHeader(header: PaymentHeader): string {
  const json = JSON.stringify(header);
  const base64 = base64Encode(json);
  // Convert to base64url
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode payment header from base64url JSON
 */
export function decodePaymentHeader(encoded: string): PaymentHeader {
  // Convert from base64url to base64
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '=';
  }
  const json = base64Decode(base64);
  return JSON.parse(json) as PaymentHeader;
}

/**
 * Encode payment challenge as JSON (for response body)
 */
export function encodeChallengeBody(challenge: PaymentChallenge): string {
  return JSON.stringify(challenge, null, 2);
}

/**
 * Decode payment challenge from JSON
 */
export function decodeChallengeBody(json: string): PaymentChallenge {
  return JSON.parse(json) as PaymentChallenge;
}

/**
 * Encode payment response header as base64url JSON
 */
export function encodePaymentResponse(
  response: Record<string, unknown>
): string {
  const json = JSON.stringify(response);
  const base64 = base64Encode(json);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode payment response from base64url JSON
 */
export function decodePaymentResponse(
  encoded: string
): Record<string, unknown> {
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const json = base64Decode(base64);
  return JSON.parse(json) as Record<string, unknown>;
}
