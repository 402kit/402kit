import {
  PaymentChallenge,
  PaymentHeader,
  PaymentResponse,
  decodeChallengeBody,
  encodePaymentHeader,
  decodePaymentResponse,
  validatePaymentResponse,
  validateChallenge,
} from '@402kit/core';

/**
 * Payment adapter interface
 */
export interface PaymentAdapter {
  name: string;
  initiate(
    challenge: PaymentChallenge,
    ctx: AdapterContext
  ): Promise<PaymentHeader>;
}

/**
 * Adapter context
 */
export interface AdapterContext {
  request?: Request;
  metadata?: Record<string, unknown>;
  getAdapter(name: string): PaymentAdapter;
}

/**
 * Client configuration
 */
export interface ClientConfig {
  /**
   * Payment adapters
   */
  adapters: Record<string, PaymentAdapter>;
  /**
   * Resolve payment for a challenge
   */
  resolvePayment: (
    challenge: PaymentChallenge,
    ctx: AdapterContext
  ) => Promise<PaymentHeader>;
  /**
   * Hook: called when 402 is received
   */
  onPaymentRequired?: (challenge: PaymentChallenge) => void | Promise<void>;
  /**
   * Hook: called when payment is verified
   */
  onVerified?: (response: PaymentResponse) => void | Promise<void>;
  /**
   * Maximum retry attempts for 402
   */
  maxRetries?: number;
  /**
   * Custom fetch implementation
   */
  fetch?: typeof fetch;
}

/**
 * 402-aware HTTP client
 */
export class Client {
  private readonly fetchFn: typeof fetch;
  private readonly maxRetries: number;

  constructor(private readonly config: ClientConfig) {
    this.fetchFn = config.fetch ?? globalThis.fetch.bind(globalThis);
    this.maxRetries = config.maxRetries ?? 3;
  }

  /**
   * Fetch with automatic 402 payment handling
   */
  async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let attempt = 0;

    while (attempt < this.maxRetries) {
      const response = await this.fetchFn(input, init);

      // If not 402, return response
      if (response.status !== 402) {
        // Check for X-PAYMENT-RESPONSE header
        const paymentResponseHeader =
          response.headers.get('X-PAYMENT-RESPONSE');
        if (paymentResponseHeader && this.config.onVerified) {
          try {
            const parsed = decodePaymentResponse(paymentResponseHeader);
            if (validatePaymentResponse(parsed)) {
              await this.config.onVerified(parsed);
            }
          } catch {
            // Ignore decode/validation errors
          }
        }
        return response;
      }

      // Handle 402 Payment Required
      attempt++;

      try {
        // Parse challenge from response body
        const body = await response.text();
        const challenge = decodeChallengeBody(body);

        if (!validateChallenge(challenge)) {
          throw new Error('Invalid payment challenge schema');
        }

        // Call hook
        if (this.config.onPaymentRequired) {
          await this.config.onPaymentRequired(challenge);
        }

        // Resolve payment
        const ctx: AdapterContext = {
          request: new Request(input, init),
          getAdapter: (name: string) => {
            const adapter = this.config.adapters[name];
            if (!adapter) {
              throw new Error(`Adapter not found: ${name}`);
            }
            return adapter;
          },
        };

        const paymentHeader = await this.config.resolvePayment(challenge, ctx);

        // Encode header
        const encodedHeader = encodePaymentHeader(paymentHeader);

        // Retry request with X-PAYMENT header
        const retryInit: RequestInit = {
          ...init,
          headers: {
            ...init?.headers,
            'X-PAYMENT': encodedHeader,
          },
        };

        // Loop will retry with payment header
        init = retryInit;
        continue;
      } catch (error) {
        throw new Error(
          `Failed to resolve payment (attempt ${attempt}/${this.maxRetries}): ${error}`
        );
      }
    }

    throw new Error(
      `Maximum retry attempts (${this.maxRetries}) exceeded for 402 payment`
    );
  }
}

/**
 * Create a 402-aware HTTP client
 */
export function createClient(config: ClientConfig): Client {
  return new Client(config);
}
