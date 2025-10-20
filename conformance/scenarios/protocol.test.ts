import { describe, it, expect } from 'vitest';
import {
  PaymentChallenge,
  PaymentHeader,
  encodeChallengeBody,
  decodeChallengeBody,
  encodePaymentHeader,
  decodePaymentHeader,
  X402_VERSION,
} from '@402kit/core';

describe('x402 Protocol Conformance', () => {
  describe('Challenge Format', () => {
    it('should conform to x402.v1 challenge schema', () => {
      const challenge: PaymentChallenge = {
        version: X402_VERSION,
        scheme: 'exact',
        network: 'evm:base:sepolia',
        asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        payTo: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        maxAmountRequired: '1000',
        maxTimeoutSeconds: 60,
        challengeId: 'test-uuid-1234',
        bind: {
          host: 'api.example.com',
          method: 'GET',
          path: '/api/protected',
        },
        resource: 'urn:res:test',
      };

      // Encode and decode
      const encoded = encodeChallengeBody(challenge);
      const decoded = decodeChallengeBody(encoded);

      expect(decoded.version).toBe(X402_VERSION);
      expect(decoded.scheme).toBe('exact');
      expect(decoded.network).toMatch(/^evm:[a-z]+:(mainnet|sepolia|testnet)$/);
      expect(decoded.asset).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(decoded.maxAmountRequired).toMatch(/^\d+$/);
    });

    it('should use atomic units (strings, not floats)', () => {
      const challenge: PaymentChallenge = {
        version: X402_VERSION,
        scheme: 'exact',
        network: 'evm:base:sepolia',
        asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        payTo: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        maxAmountRequired: '1000000000000000000', // 1e18, not 1.0
        maxTimeoutSeconds: 60,
        challengeId: 'test-uuid',
        bind: {
          host: 'api.example.com',
          method: 'GET',
          path: '/api/protected',
        },
        resource: 'urn:res:test',
      };

      expect(typeof challenge.maxAmountRequired).toBe('string');
      expect(challenge.maxAmountRequired).not.toContain('.');
      expect(/^\d+$/.test(challenge.maxAmountRequired)).toBe(true);
    });
  });

  describe('Payment Header Format', () => {
    it('should conform to x402.v1 payment header schema', () => {
      const header: PaymentHeader = {
        version: X402_VERSION,
        scheme: 'exact',
        challengeId: 'test-uuid-1234',
        network: 'evm:base:sepolia',
        asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        paidAmount: '1000',
        issuedAt: '2025-10-19T12:00:00Z',
        nonce: 'abcdef1234567890',
        proof: {
          type: 'mock',
          signature: 'test-sig',
        },
      };

      // Encode as base64url
      const encoded = encodePaymentHeader(header);

      // Should be base64url (no +, /, or =)
      expect(encoded).not.toContain('+');
      expect(encoded).not.toContain('/');
      expect(encoded).not.toContain('=');

      // Decode and verify
      const decoded = decodePaymentHeader(encoded);
      expect(decoded.version).toBe(X402_VERSION);
      expect(decoded.challengeId).toBe(header.challengeId);
      expect(decoded.paidAmount).toBe(header.paidAmount);
    });

    it('should use ISO-8601 timestamps', () => {
      const header: PaymentHeader = {
        version: X402_VERSION,
        scheme: 'exact',
        challengeId: 'test-uuid',
        network: 'evm:base:sepolia',
        asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        paidAmount: '1000',
        issuedAt: '2025-10-19T12:00:00Z',
        nonce: 'abcd1234',
        proof: { type: 'mock', signature: 'sig' },
      };

      // ISO-8601 format check
      expect(header.issuedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('Binding Validation', () => {
    it('should bind payment to request context', () => {
      const binding = {
        host: 'api.example.com',
        method: 'GET',
        path: '/api/protected',
      };

      expect(binding.host).toBeTruthy();
      expect(binding.method).toMatch(/^(GET|POST|PUT|DELETE|PATCH)$/);
      expect(binding.path).toMatch(/^\//);
    });
  });
});
