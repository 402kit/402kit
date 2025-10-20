/**
 * Anti-replay protection using in-memory store
 * For production, use Redis or similar distributed store
 */
export class ReplayStore {
  private seen: Map<string, number> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(
    private readonly ttlMs: number = 60_000,
    private readonly maxEntries: number = 10_000
  ) {
    // Periodic cleanup of expired entries
    this.cleanupInterval = setInterval(() => this.cleanup(), ttlMs);
  }

  /**
   * Check if a (challengeId, nonce) pair has been seen
   */
  has(challengeId: string, nonce: string): boolean {
    const key = `${challengeId}:${nonce}`;
    const expiry = this.seen.get(key);
    if (!expiry) return false;

    if (Date.now() > expiry) {
      this.seen.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Mark a (challengeId, nonce) pair as seen
   */
  add(challengeId: string, nonce: string): void {
    const key = `${challengeId}:${nonce}`;
    const expiry = Date.now() + this.ttlMs;
    this.seen.set(key, expiry);

    // Prevent unbounded growth
    if (this.seen.size > this.maxEntries) {
      this.cleanup();
    }
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, expiry] of this.seen.entries()) {
      if (now > expiry) {
        this.seen.delete(key);
      }
    }
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.seen.clear();
  }

  /**
   * Destroy store and stop cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

/**
 * Global singleton replay store (for convenience)
 */
export const defaultReplayStore = new ReplayStore();

/**
 * Validate timestamp is within acceptable clock skew
 */
export function isTimestampValid(
  issuedAt: string,
  maxSkewSeconds: number = 60
): boolean {
  try {
    const issued = new Date(issuedAt).getTime();
    const now = Date.now();
    const diff = Math.abs(now - issued);
    return diff <= maxSkewSeconds * 1000;
  } catch {
    return false;
  }
}

/**
 * Check if challenge has expired
 */
export function isChallengeExpired(
  challengeCreatedAt: Date,
  maxTimeoutSeconds: number
): boolean {
  const expiresAt = challengeCreatedAt.getTime() + maxTimeoutSeconds * 1000;
  return Date.now() > expiresAt;
}
