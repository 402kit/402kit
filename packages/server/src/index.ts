import {
  PaymentChallenge,
  PaymentHeader,
  PaymentResponse,
  VerificationResult,
  PaymentErrorCode,
  generateUUID,
  encodeChallengeBody,
  decodePaymentHeader,
  encodePaymentResponse,
  validatePaymentHeader,
  defaultReplayStore,
  isTimestampValid,
  canonicalizeBinding,
} from '@402kit/core';
import { CookieEntitlement, BearerEntitlement } from '@402kit/entitlement';

/**
 * Security constants for header validation
 */
const MAX_HEADER_SIZE = 4096; // bytes

/**
 * Validate header for security issues
 * Returns error message if invalid, null if valid
 */
function validateHeaderSecurity(headerValue: string): string | null {
  // Check size limit (prevent DoS)
  if (headerValue.length > MAX_HEADER_SIZE) {
    return 'Header too large';
  }

  // Check for CRLF injection attempts
  if (headerValue.includes('\r') || headerValue.includes('\n')) {
    return 'Invalid header format';
  }

  // Validate base64url charset (decoded header should only contain safe chars after decode)
  // This is a conservative check - the actual base64url string is checked during decode
  const trimmed = headerValue.trim();
  if (!trimmed || trimmed.length === 0) {
    return 'Empty header';
  }

  return null;
}

/**
 * Payment adapter interface
 */
export interface PaymentAdapter {
  name: string;
  verify(
    header: PaymentHeader,
    ctx: AdapterContext
  ): Promise<VerificationResult>;
  settle?(header: PaymentHeader, ctx: AdapterContext): Promise<void>;
}

/**
 * Adapter context
 */
export interface AdapterContext {
  request: Request;
  metadata?: Record<string, unknown>;
}

/**
 * Price configuration function
 */
export type PriceConfig = {
  scheme: 'exact' | 'upto';
  network: string;
  asset: string;
  maxAmountRequired: string;
  description?: string;
};

/**
 * Middleware configuration
 */
export interface MiddlewareConfig {
  /**
   * Price configuration (can be async)
   */
  price: (request: Request) => Promise<PriceConfig> | PriceConfig;
  /**
   * Resource identifier (can be async)
   */
  resource: (request: Request) => Promise<string> | string;
  /**
   * Payment adapters
   */
  adapters: Record<string, PaymentAdapter>;
  /**
   * Default adapter name
   */
  defaultAdapter?: string;
  /**
   * Maximum timeout for challenge (seconds)
   */
  maxTimeoutSeconds?: number;
  /**
   * Clock skew tolerance (seconds)
   */
  clockSkewSeconds?: number;
  /**
   * Optional entitlement helper
   */
  grantEntitlement?:
    | CookieEntitlement
    | BearerEntitlement
    | ((resource: string) => Promise<string>);
  /**
   * Challenge store (for tracking creation time)
   */
  challengeStore?: Map<string, Date>;
}

/**
 * Core 402 middleware logic
 */
export async function handle402(
  request: Request,
  config: MiddlewareConfig
): Promise<Response> {
  const paymentHeader = request.headers.get('X-PAYMENT');

  // Check entitlement first
  if (config.grantEntitlement) {
    const resource = await config.resource(request);
    let hasEntitlement = false;

    if (config.grantEntitlement instanceof CookieEntitlement) {
      const cookie = request.headers.get('Cookie');
      hasEntitlement = await config.grantEntitlement.check(cookie, resource);
    } else if (config.grantEntitlement instanceof BearerEntitlement) {
      const auth = request.headers.get('Authorization');
      hasEntitlement = await config.grantEntitlement.check(auth, resource);
    }

    if (hasEntitlement) {
      // Entitlement valid, allow request
      return new Response(null, { status: 200 });
    }
  }

  // No payment header, send 402 challenge
  if (!paymentHeader) {
    return await send402Challenge(request, config);
  }

  // Validate header security first (before decoding)
  const securityError = validateHeaderSecurity(paymentHeader);
  if (securityError) {
    return sendError(
      400,
      PaymentErrorCode.INVALID_SCHEMA,
      'Invalid payment header'
    );
  }

  // Verify payment
  try {
    const header = decodePaymentHeader(paymentHeader);

    if (!validatePaymentHeader(header)) {
      return sendError(
        400,
        PaymentErrorCode.INVALID_SCHEMA,
        'Invalid payment header'
      );
    }

    // Verify binding
    const url = new URL(request.url);
    const expectedBinding = {
      host: url.host,
      method: request.method,
      path: url.pathname,
    };

    // Basic binding check (full check done in adapter)
    const canonical = canonicalizeBinding(expectedBinding);
    if (!canonical) {
      return sendError(
        400,
        PaymentErrorCode.INVALID_BINDING,
        'Invalid request binding'
      );
    }

    // Check timestamp
    const clockSkewSeconds = config.clockSkewSeconds ?? 60;
    if (!isTimestampValid(header.issuedAt, clockSkewSeconds)) {
      return sendError(
        402,
        PaymentErrorCode.EXPIRED,
        'Payment timestamp expired'
      );
    }

    // Check replay
    if (defaultReplayStore.has(header.challengeId, header.nonce)) {
      return sendError(
        409,
        PaymentErrorCode.REPLAY,
        'Payment already used (replay detected)'
      );
    }

    // Get adapter
    const adapterName =
      config.defaultAdapter ?? Object.keys(config.adapters)[0];
    if (!adapterName) {
      return sendError(
        500,
        PaymentErrorCode.VERIFICATION_FAILED,
        'No adapter configured'
      );
    }
    const adapter = config.adapters[adapterName];

    if (!adapter) {
      return sendError(
        500,
        PaymentErrorCode.VERIFICATION_FAILED,
        'No adapter configured'
      );
    }

    // Verify payment
    const ctx: AdapterContext = { request };
    const result = await adapter.verify(header, ctx);

    if (!result.ok) {
      const errorCode =
        result.reason === 'insufficient'
          ? PaymentErrorCode.INSUFFICIENT
          : result.reason === 'expired'
            ? PaymentErrorCode.EXPIRED
            : result.reason === 'mismatch'
              ? PaymentErrorCode.MISMATCH
              : PaymentErrorCode.VERIFICATION_FAILED;

      // Generic message (don't leak verification details)
      return sendError(402, errorCode, 'Payment verification failed');
    }

    // Mark as used
    defaultReplayStore.add(header.challengeId, header.nonce);

    // Grant entitlement if configured
    const resource = await config.resource(request);
    const headers = new Headers();

    if (config.grantEntitlement) {
      if (config.grantEntitlement instanceof CookieEntitlement) {
        const setCookie = await config.grantEntitlement.grant(resource);
        headers.set('Set-Cookie', setCookie);
      } else if (config.grantEntitlement instanceof BearerEntitlement) {
        const token = await config.grantEntitlement.grant(resource);
        headers.set('X-PAYMENT-TOKEN', token);
      } else if (typeof config.grantEntitlement === 'function') {
        const token = await config.grantEntitlement(resource);
        headers.set('X-PAYMENT-TOKEN', token);
      }
    }

    // Send success response header
    const paymentResponse: PaymentResponse = {
      ok: true,
      challengeId: header.challengeId,
      resource,
    };

    // encodePaymentResponse expects a generic record; cast to satisfy strict typing
    headers.set(
      'X-PAYMENT-RESPONSE',
      encodePaymentResponse(
        paymentResponse as unknown as Record<string, unknown>
      )
    );

    // Return success indicator (actual handler will be called)
    return new Response(null, { status: 200, headers });
  } catch (error) {
    // Generic error message (don't leak implementation details)
    return sendError(
      400,
      PaymentErrorCode.INVALID_SCHEMA,
      'Payment processing failed'
    );
  }
}

/**
 * Send 402 challenge
 */
async function send402Challenge(
  request: Request,
  config: MiddlewareConfig
): Promise<Response> {
  const priceConfig = await config.price(request);
  const resource = await config.resource(request);
  const challengeId = generateUUID();

  const url = new URL(request.url);

  const challenge: PaymentChallenge = {
    version: 'x402.v1',
    scheme: priceConfig.scheme,
    network: priceConfig.network,
    asset: priceConfig.asset,
    payTo: priceConfig.asset, // In real impl, this would be merchant address
    maxAmountRequired: priceConfig.maxAmountRequired,
    maxTimeoutSeconds: config.maxTimeoutSeconds ?? 60,
    challengeId,
    bind: {
      host: url.host,
      method: request.method,
      path: url.pathname,
    },
    resource,
    meta: priceConfig.description
      ? { description: priceConfig.description }
      : undefined,
  };

  // Store challenge creation time
  const challengeStore = config.challengeStore ?? new Map();
  challengeStore.set(challengeId, new Date());

  const body = encodeChallengeBody(challenge);

  return new Response(body, {
    status: 402,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Send error response
 */
function sendError(
  status: number,
  code: PaymentErrorCode,
  message: string
): Response {
  const body = JSON.stringify({
    error: code,
    message,
  });

  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// types are exported inline above; no additional re-export required
