import { handle402, MiddlewareConfig, PriceConfig } from './index';

/**
 * Hono context interface (minimal)
 */
export interface HonoContext {
  req: {
    raw: Request;
    url: string;
    method: string;
    header: (name: string) => string | undefined;
  };
  json: (data: any, status?: number) => Response;
  text: (text: string, status?: number) => Response;
}

/**
 * Hono middleware configuration
 */
export type HonoMiddlewareConfig = Omit<
  MiddlewareConfig,
  'price' | 'resource'
> & {
  price: (ctx: HonoContext) => Promise<PriceConfig> | PriceConfig;
  resource?: (ctx: HonoContext) => Promise<string> | string;
};

/**
 * Hono 402 middleware
 */
export function hono402(config: HonoMiddlewareConfig) {
  return async (ctx: HonoContext, next: () => Promise<void>) => {
    try {
      const request = ctx.req.raw;

      // Build middleware config
      const middlewareConfig: MiddlewareConfig = {
        ...config,
        price: async (_r) => config.price(ctx),
        resource: async (_r) => {
          if (config.resource) {
            return config.resource(ctx);
          }
          const url = new URL(request.url);
          return `urn:res:${url.pathname}`;
        },
      };

      const response = await handle402(request, middlewareConfig);

      // If 402 or error, return response
      if (response.status !== 200) {
        const body = await response.text();
        return new Response(body, {
          status: response.status,
          headers: response.headers,
        });
      }

      // Success, copy headers and continue
      // In Hono, we'd set response headers via ctx, but for simplicity:
      await next();
    } catch (error) {
      return ctx.json(
        {
          error: 'internal_error',
          message: String(error),
        },
        500
      );
    }
  };
}
