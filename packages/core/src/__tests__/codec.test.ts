import { describe, it, expect } from 'vitest';
import {
  encodePaymentHeader,
  decodePaymentHeader,
  encodeChallengeBody,
  decodeChallengeBody,
} from '../codec';
import { PaymentChallenge, PaymentHeader, X402_VERSION } from '../types';

describe('codec', () => {
  describe('payment header encoding', () => {
    it('should encode and decode payment header', () => {
      const header: PaymentHeader = {
        version: X402_VERSION,
        scheme: 'exact',
        challengeId: 'test-uuid',
        network: 'evm:base:sepolia',
        asset: '0x1234567890123456789012345678901234567890',
        paidAmount: '1000',
        issuedAt: '2025-10-19T12:00:00Z',
        nonce: 'abcdef1234567890',
        proof: {
          type: 'mock',
          signature: 'test-sig',
        },
      };

      const encoded = encodePaymentHeader(header);
      expect(encoded).toBeTruthy();
      expect(encoded).not.toContain('=');
      expect(encoded).not.toContain('+');
      expect(encoded).not.toContain('/');

      const decoded = decodePaymentHeader(encoded);
      expect(decoded).toEqual(header);
    });
  });

  describe('challenge body encoding', () => {
    it('should encode and decode challenge', () => {
      const challenge: PaymentChallenge = {
        version: X402_VERSION,
        scheme: 'exact',
        network: 'evm:base:sepolia',
        asset: '0x1234567890123456789012345678901234567890',
        payTo: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        maxAmountRequired: '1000',
        maxTimeoutSeconds: 60,
        challengeId: 'test-uuid',
        bind: {
          host: 'api.example.com',
          method: 'GET',
          path: '/api/protected',
        },
        resource: 'urn:res:abc123',
      };

      const encoded = encodeChallengeBody(challenge);
      expect(encoded).toBeTruthy();

      const decoded = decodeChallengeBody(encoded);
      expect(decoded).toEqual(challenge);
    });
  });
});
