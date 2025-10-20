import {
  PaymentChallenge,
  PaymentHeader,
  VerificationResult,
  X402_VERSION,
  generateNonce,
} from '@402kit/core';

/**
 * Mock adapter configuration
 */
export interface MockAdapterConfig {
  /**
   * Deterministic mode: always succeeds for testing
   */
  deterministic?: boolean;
  /**
   * Secret key for mock signature
   */
  secretKey?: string;
}

/**
 * Adapter context interface
 */
export interface AdapterContext {
  request?: Request;
  metadata?: Record<string, unknown>;
}

/**
 * Payment adapter interface
 */
export interface PaymentAdapter {
  name: string;
  initiate(
    challenge: PaymentChallenge,
    ctx: AdapterContext
  ): Promise<PaymentHeader>;
  verify(
    header: PaymentHeader,
    ctx: AdapterContext
  ): Promise<VerificationResult>;
  settle?(header: PaymentHeader, ctx: AdapterContext): Promise<void>;
}

/**
 * Mock adapter for testing
 * Always succeeds in deterministic mode
 */
export class MockAdapter implements PaymentAdapter {
  readonly name = 'mock';

  constructor(private readonly config: MockAdapterConfig = {}) {
    this.config.deterministic = this.config.deterministic ?? true;
    this.config.secretKey = this.config.secretKey ?? 'mock-secret-key';
  }

  async initiate(
    challenge: PaymentChallenge,
    _ctx: AdapterContext
  ): Promise<PaymentHeader> {
    // Create mock payment header
    const header: PaymentHeader = {
      version: X402_VERSION,
      scheme: challenge.scheme,
      challengeId: challenge.challengeId,
      network: challenge.network,
      asset: challenge.asset,
      paidAmount: challenge.maxAmountRequired,
      issuedAt: new Date().toISOString(),
      nonce: generateNonce(),
      proof: {
        type: 'mock',
        signature: this.sign(challenge.challengeId),
      },
    };

    return header;
  }

  async verify(
    header: PaymentHeader,
    _ctx: AdapterContext
  ): Promise<VerificationResult> {
    // In deterministic mode, always succeed
    if (this.config.deterministic) {
      return {
        ok: true,
        resource: 'mock-resource',
      };
    }

    // Validate mock signature
    if (header.proof.type !== 'mock') {
      return {
        ok: false,
        reason: 'invalid',
      };
    }

    const expectedSig = this.sign(header.challengeId);
    if ('signature' in header.proof && header.proof.signature === expectedSig) {
      return {
        ok: true,
        resource: 'mock-resource',
      };
    }

    return {
      ok: false,
      reason: 'invalid',
    };
  }

  private sign(data: string): string {
    // Simple mock signature (not cryptographically secure)
    return `mock-sig-${data}-${this.config.secretKey}`;
  }
}

/**
 * Create a mock adapter
 */
export function mockAdapter(config?: MockAdapterConfig): MockAdapter {
  return new MockAdapter(config);
}
