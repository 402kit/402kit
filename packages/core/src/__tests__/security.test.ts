import { describe, it, expect } from 'vitest';
import { generateNonce, generateUUID } from '../canonical';

describe('security', () => {
  describe('generateNonce', () => {
    it('should generate base64url nonce', () => {
      const nonce = generateNonce();
      expect(nonce).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('should generate nonces with sufficient entropy', () => {
      const nonces = new Set<string>();
      for (let i = 0; i < 100; i++) {
        nonces.add(generateNonce());
      }
      expect(nonces.size).toBe(100); // All unique
    });

    it('should generate consistent length nonces', () => {
      const nonce = generateNonce();
      // 128 bits = 16 bytes → base64url = 22 chars (no padding)
      expect(nonce.length).toBeGreaterThanOrEqual(21);
      expect(nonce.length).toBeLessThanOrEqual(24);
    });
  });

  describe('generateUUID', () => {
    it('should generate valid UUID v4 format', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
      );
    });

    it('should generate UUIDs with sufficient entropy', () => {
      const uuids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        uuids.add(generateUUID());
      }
      expect(uuids.size).toBe(100); // All unique
    });
  });
});
