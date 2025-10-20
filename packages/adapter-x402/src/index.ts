import {
  PaymentChallenge,
  PaymentHeader,
  VerificationResult,
  X402_VERSION,
  generateNonce,
} from '@402kit/core';

/**
 * x402 facilitator adapter configuration
 */
export interface X402AdapterConfig {
  /**
   * Facilitator verify URL
   */
  verifyUrl: string;
  /**
   * Facilitator settle URL (optional)
   */
  settleUrl?: string;
  /**
   * Timeout for facilitator requests (ms)
   */
  timeout?: number;
  /**
   * Custom fetch implementation
   */
  fetch?: typeof fetch;
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
 * x402 facilitator response
 */
interface FacilitatorInitiateResponse {
  ticket: string;
  verifyUrl: string;
  settleUrl: string;
}

interface FacilitatorVerifyResponse {
  ok: boolean;
  resource?: string;
  reason?: string;
  details?: unknown;
}

/**
 * x402 facilitator adapter
 */
export class X402Adapter implements PaymentAdapter {
  readonly name = 'x402';
  private readonly fetchFn: typeof fetch;

  constructor(private readonly config: X402AdapterConfig) {
    this.fetchFn = config.fetch ?? globalThis.fetch;
    this.config.timeout = this.config.timeout ?? 10_000;
  }

  async initiate(
    challenge: PaymentChallenge,
    _ctx: AdapterContext
  ): Promise<PaymentHeader> {
    // Call facilitator to initiate payment
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await this.fetchFn(this.config.verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'initiate',
          challenge,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Facilitator initiate failed: ${response.status} ${response.statusText}`
        );
      }

      const dataRaw = await response.json();
      const data = dataRaw as Partial<FacilitatorInitiateResponse>;

      // Build payment header
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
          type: 'facilitator',
          verifyUrl:
            typeof data.verifyUrl === 'string'
              ? data.verifyUrl
              : this.config.verifyUrl,
          settleUrl:
            typeof data.settleUrl === 'string'
              ? data.settleUrl
              : this.config.settleUrl || this.config.verifyUrl,
          ticket: typeof data.ticket === 'string' ? data.ticket : '',
        },
      };

      return header;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async verify(
    header: PaymentHeader,
    _ctx: AdapterContext
  ): Promise<VerificationResult> {
    if (header.proof.type !== 'facilitator') {
      return {
        ok: false,
        reason: 'invalid',
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await this.fetchFn(header.proof.verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verify',
          header,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        return {
          ok: false,
          reason: 'invalid',
        };
      }

      const data = (await response.json()) as FacilitatorVerifyResponse;
      return {
        ok: data.ok,
        reason: data.reason as VerificationResult['reason'],
        resource: data.resource,
        details: data.details,
      };
    } catch (error) {
      return {
        ok: false,
        reason: 'invalid',
        details: { error: String(error) },
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async settle(header: PaymentHeader, _ctx: AdapterContext): Promise<void> {
    if (header.proof.type !== 'facilitator') {
      throw new Error('Invalid proof type for settle');
    }

    if (!this.config.settleUrl && !header.proof.settleUrl) {
      // Settle is optional
      return;
    }

    const settleUrl = header.proof.settleUrl || this.config.settleUrl;
    if (!settleUrl) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      await this.fetchFn(settleUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'settle',
          header,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Create an x402 facilitator adapter
 */
export function x402Adapter(config: X402AdapterConfig): X402Adapter {
  return new X402Adapter(config);
}
