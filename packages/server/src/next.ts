import { handle402, MiddlewareConfig, PriceConfig } from './index';

/**
 * Next.js Route Handler configuration
 */
export type NextMiddlewareConfig = Omit<
  MiddlewareConfig,
  'price' | 'resource'
> & {
  price: (req: Request) => Promise<PriceConfig> | PriceConfig;
  resource?: (req: Request) => Promise<string> | string;
};

/**
 * Next.js 402 Route Handler wrapper
 */
export function next402<T extends (...args: any[]) => Promise<Response>>(
  config: NextMiddlewareConfig,
  handler: T
): (request: Request, context?: any) => Promise<Response> {
  return async (request: Request, context?: any) => {
    try {
      // Build middleware config
      const middlewareConfig: MiddlewareConfig = {
        ...config,
        price: async (_r) => config.price(request),
        resource: async (_r) => {
          if (config.resource) {
            return config.resource(request);
          }
          const url = new URL(request.url);
          return `urn:res:${url.pathname}`;
        },
      };

      const response = await handle402(request, middlewareConfig);

      // If 402 or error, return response
      if (response.status !== 200) {
        return response;
      }

      // Success, call handler and merge headers
      const handlerResponse = await handler(request, context);

      // Copy payment headers to handler response
      const headers = new Headers(handlerResponse.headers);
      response.headers.forEach((value, key) => {
        headers.set(key, value);
      });

      return new Response(handlerResponse.body, {
        status: handlerResponse.status,
        statusText: handlerResponse.statusText,
        headers,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'internal_error',
          message: String(error),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}

/**
 * Next.js GET handler wrapper
 */
export const GET = (
  config: NextMiddlewareConfig,
  handler: (request: Request, context?: any) => Promise<Response>
) => next402(config, handler);

/**
 * Next.js POST handler wrapper
 */
export const POST = (
  config: NextMiddlewareConfig,
  handler: (request: Request, context?: any) => Promise<Response>
) => next402(config, handler);
