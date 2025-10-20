import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { handle402, MiddlewareConfig, PriceConfig } from './index';

/**
 * Express middleware configuration
 */
export type ExpressMiddlewareConfig = Omit<
  MiddlewareConfig,
  'price' | 'resource'
> & {
  price: (req: Request) => Promise<PriceConfig> | PriceConfig;
  resource?: (req: Request) => Promise<string> | string;
};

/**
 * Express 402 middleware
 */
export function express402(config: ExpressMiddlewareConfig): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Build Web API Request from Express request
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      const headers = new Headers();

      for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === 'string') {
          headers.set(key, value);
        } else if (Array.isArray(value)) {
          for (const v of value) {
            headers.append(key, v);
          }
        }
      }

      const webRequest = new Request(url, {
        method: req.method,
        headers,
      });

      // Build middleware config
      const middlewareConfig: MiddlewareConfig = {
        ...config,
        price: async (_r) => config.price(req),
        resource: async (_r) =>
          config.resource ? config.resource(req) : `urn:res:${req.path}`,
      };

      const response = await handle402(webRequest, middlewareConfig);

      // If 402 or error, send response
      if (response.status !== 200) {
        res.status(response.status);
        response.headers.forEach((value, key) => {
          res.setHeader(key, value);
        });
        const body = await response.text();
        res.send(body);
        return;
      }

      // Success, copy headers and continue
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      next();
    } catch (error) {
      res.status(500).json({
        error: 'internal_error',
        message: String(error),
      });
    }
  };
}
