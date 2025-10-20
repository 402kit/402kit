import { generateUUID } from '@402kit/core';

/**
 * Entitlement store interface
 */
export interface EntitlementStore {
  has(token: string, resource: string): Promise<boolean>;
  set(token: string, resource: string, ttlSeconds: number): Promise<void>;
  delete(token: string): Promise<void>;
}

/**
 * In-memory entitlement store
 */
export class MemoryEntitlementStore implements EntitlementStore {
  private store: Map<string, { resource: string; expiresAt: number }> =
    new Map();

  async has(token: string, resource: string): Promise<boolean> {
    const entry = this.store.get(token);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(token);
      return false;
    }

    return entry.resource === resource;
  }

  async set(
    token: string,
    resource: string,
    ttlSeconds: number
  ): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(token, { resource, expiresAt });
  }

  async delete(token: string): Promise<void> {
    this.store.delete(token);
  }
}

/**
 * Cookie-based entitlement configuration
 */
export interface CookieEntitlementConfig {
  cookieName?: string;
  ttlSeconds?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  store?: EntitlementStore;
}

/**
 * Cookie-based entitlement helper
 */
export class CookieEntitlement {
  private readonly cookieName: string;
  private readonly ttlSeconds: number;
  private readonly domain?: string;
  private readonly path: string;
  private readonly secure: boolean;
  private readonly httpOnly: boolean;
  private readonly sameSite: 'strict' | 'lax' | 'none';
  private readonly store: EntitlementStore;

  constructor(config: CookieEntitlementConfig = {}) {
    this.cookieName = config.cookieName ?? '402_access';
    this.ttlSeconds = config.ttlSeconds ?? 3600;
    this.domain = config.domain;
    this.path = config.path ?? '/';
    this.secure = config.secure ?? true;
    this.httpOnly = config.httpOnly ?? true;
    this.sameSite = config.sameSite ?? 'lax';
    this.store = config.store ?? new MemoryEntitlementStore();
  }

  /**
   * Grant entitlement (returns Set-Cookie header value)
   */
  async grant(resource: string): Promise<string> {
    const token = generateUUID();
    await this.store.set(token, resource, this.ttlSeconds);

    const parts = [
      `${this.cookieName}=${token}`,
      `Max-Age=${this.ttlSeconds}`,
      `Path=${this.path}`,
      `SameSite=${this.sameSite}`,
    ];

    if (this.domain) {
      parts.push(`Domain=${this.domain}`);
    }

    if (this.secure) {
      parts.push('Secure');
    }

    if (this.httpOnly) {
      parts.push('HttpOnly');
    }

    return parts.join('; ');
  }

  /**
   * Check entitlement from cookie header
   */
  async check(cookieHeader: string | null, resource: string): Promise<boolean> {
    if (!cookieHeader) return false;

    const cookies = this.parseCookies(cookieHeader);
    const token = cookies[this.cookieName];

    if (!token) return false;

    return this.store.has(token, resource);
  }

  /**
   * Revoke entitlement (returns Set-Cookie header to clear)
   */
  async revoke(cookieHeader: string | null): Promise<string | null> {
    if (!cookieHeader) return null;

    const cookies = this.parseCookies(cookieHeader);
    const token = cookies[this.cookieName];

    if (!token) return null;

    await this.store.delete(token);

    return `${this.cookieName}=; Max-Age=0; Path=${this.path}`;
  }

  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    for (const cookie of cookieHeader.split(';')) {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        cookies[key] = value;
      }
    }
    return cookies;
  }
}

/**
 * Bearer token entitlement configuration
 */
export interface BearerEntitlementConfig {
  ttlSeconds?: number;
  store?: EntitlementStore;
}

/**
 * Bearer token entitlement helper
 */
export class BearerEntitlement {
  private readonly ttlSeconds: number;
  private readonly store: EntitlementStore;

  constructor(config: BearerEntitlementConfig = {}) {
    this.ttlSeconds = config.ttlSeconds ?? 3600;
    this.store = config.store ?? new MemoryEntitlementStore();
  }

  /**
   * Grant entitlement (returns bearer token)
   */
  async grant(resource: string): Promise<string> {
    const token = generateUUID();
    await this.store.set(token, resource, this.ttlSeconds);
    return token;
  }

  /**
   * Check entitlement from Authorization header
   */
  async check(authHeader: string | null, resource: string): Promise<boolean> {
    if (!authHeader) return false;

    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match || !match[1]) return false;

    const token = match[1];
    return this.store.has(token, resource);
  }

  /**
   * Revoke entitlement
   */
  async revoke(authHeader: string | null): Promise<void> {
    if (!authHeader) return;

    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match || !match[1]) return;

    const token = match[1];
    await this.store.delete(token);
  }
}

/**
 * Factory functions
 */
export const entitlement = {
  cookie: (config?: CookieEntitlementConfig) => new CookieEntitlement(config),
  bearer: (config?: BearerEntitlementConfig) => new BearerEntitlement(config),
};
