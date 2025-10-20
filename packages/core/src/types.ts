/**
 * x402 Protocol Version
 */
export const X402_VERSION = 'x402.v1';

/**
 * Payment scheme types
 */
export type PaymentScheme = 'exact' | 'upto';

/**
 * Network identifier format: <chain>:<network>:<environment>
 * Examples: evm:base:sepolia, evm:base:mainnet, evm:polygon:mainnet
 */
export type NetworkId = string;

/**
 * Ethereum address (checksum format)
 */
export type EthAddress = string;

/**
 * Atomic unit amount (string to avoid float precision issues)
 */
export type AtomicAmount = string;

/**
 * ISO-8601 timestamp
 */
export type ISO8601 = string;

/**
 * Resource binding specification
 */
export interface ResourceBinding {
  host: string;
  method: string;
  path: string;
  bodySha256?: string | null;
}

/**
 * Payment challenge (server → client in 402 response body)
 */
export interface PaymentChallenge {
  version: typeof X402_VERSION;
  scheme: PaymentScheme;
  network: NetworkId;
  asset: EthAddress;
  payTo: EthAddress;
  maxAmountRequired: AtomicAmount;
  maxTimeoutSeconds: number;
  challengeId: string;
  bind: ResourceBinding;
  resource: string;
  meta?: {
    description?: string;
    [key: string]: unknown;
  };
}

/**
 * Proof types for payment verification
 */
export type ProofType = 'facilitator' | 'onchain' | 'mock';

/**
 * Facilitator proof structure
 */
export interface FacilitatorProof {
  type: 'facilitator';
  verifyUrl: string;
  settleUrl: string;
  ticket: string;
}

/**
 * Mock proof structure (for testing)
 */
export interface MockProof {
  type: 'mock';
  signature: string;
}

/**
 * On-chain proof structure (future)
 */
export interface OnchainProof {
  type: 'onchain';
  txHash: string;
  blockNumber?: number;
}

export type PaymentProof = FacilitatorProof | MockProof | OnchainProof;

/**
 * Payment header payload (client → server in X-PAYMENT header)
 */
export interface PaymentHeader {
  version: typeof X402_VERSION;
  scheme: PaymentScheme;
  challengeId: string;
  network: NetworkId;
  asset: EthAddress;
  paidAmount: AtomicAmount;
  payer?: EthAddress;
  issuedAt: ISO8601;
  nonce: string;
  proof: PaymentProof;
}

/**
 * Entitlement type
 */
export type EntitlementType = 'cookie' | 'bearer' | 'none';

/**
 * Entitlement configuration
 */
export interface EntitlementConfig {
  type: EntitlementType;
  ttlSeconds?: number;
}

/**
 * Payment response header (optional server → client)
 */
export interface PaymentResponse {
  ok: boolean;
  challengeId: string;
  resource: string;
  entitlement?: EntitlementConfig;
  error?: string;
  reason?: string;
}

/**
 * Verification result
 */
export interface VerificationResult {
  ok: boolean;
  reason?: 'insufficient' | 'expired' | 'mismatch' | 'replay' | 'invalid';
  resource?: string;
  details?: unknown;
}

/**
 * Error codes for 402 payment flow
 */
export enum PaymentErrorCode {
  EXPIRED = 'expired',
  INSUFFICIENT = 'insufficient',
  MISMATCH = 'mismatch',
  REPLAY = 'replay',
  INVALID_SCHEMA = 'invalid_schema',
  INVALID_BINDING = 'invalid_binding',
  VERIFICATION_FAILED = 'verification_failed',
}

/**
 * 402 Error response
 */
export interface PaymentError {
  error: PaymentErrorCode;
  message: string;
  challengeId?: string;
}
