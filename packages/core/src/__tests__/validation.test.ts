import { describe, it, expect } from 'vitest';
import {
  validateChallenge,
  validatePaymentHeader,
  validateAtomicAmount,
  validateEthAddress,
  validateNetworkId,
} from '../validation';
import { PaymentChallenge, PaymentHeader, X402_VERSION } from '../types';

describe('validation', () => {
  describe('validateChallenge', () => {
    it('should validate valid challenge', () => {
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

      expect(validateChallenge(challenge)).toBe(true);
    });

    it('should reject invalid amounts', () => {
      const challenge = {
        version: X402_VERSION,
        scheme: 'exact',
        network: 'evm:base:sepolia',
        asset: '0x1234567890123456789012345678901234567890',
        payTo: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        maxAmountRequired: '10.5',
        maxTimeoutSeconds: 60,
        challengeId: 'test-uuid',
        bind: {
          host: 'api.example.com',
          method: 'GET',
          path: '/api/protected',
        },
        resource: 'urn:res:abc123',
      };

      expect(validateChallenge(challenge)).toBe(false);
    });
  });

  describe('validatePaymentHeader', () => {
    it('should validate valid payment header', () => {
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

      expect(validatePaymentHeader(header)).toBe(true);
    });
  });

  describe('validateAtomicAmount', () => {
    it('should accept valid atomic amounts', () => {
      expect(validateAtomicAmount('0')).toBe(true);
      expect(validateAtomicAmount('1000')).toBe(true);
      expect(validateAtomicAmount('123456789012345')).toBe(true);
    });

    it('should reject invalid amounts', () => {
      expect(validateAtomicAmount('10.5')).toBe(false);
      expect(validateAtomicAmount('-100')).toBe(false);
      expect(validateAtomicAmount('abc')).toBe(false);
    });
  });

  describe('validateEthAddress', () => {
    it('should accept valid addresses', () => {
      expect(
        validateEthAddress('0x1234567890123456789012345678901234567890')
      ).toBe(true);
      expect(
        validateEthAddress('0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD')
      ).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(validateEthAddress('0x123')).toBe(false);
      expect(
        validateEthAddress('1234567890123456789012345678901234567890')
      ).toBe(false);
    });
  });

  describe('validateNetworkId', () => {
    it('should accept valid network IDs', () => {
      expect(validateNetworkId('evm:base:sepolia')).toBe(true);
      expect(validateNetworkId('evm:polygon:mainnet')).toBe(true);
    });

    it('should reject invalid network IDs', () => {
      expect(validateNetworkId('evm:base')).toBe(false);
      expect(validateNetworkId('invalid')).toBe(false);
    });
  });
});
