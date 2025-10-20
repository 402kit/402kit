import { next402 } from '@402kit/server/next';
import { mockAdapter } from '@402kit/adapter-mock';
import { entitlement } from '@402kit/entitlement';

export const GET = next402(
  {
    price: async () => ({
      scheme: 'exact',
      network: 'evm:base:sepolia',
      asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      maxAmountRequired: '1000',
      description: 'Access to protected API',
    }),
    resource: () => 'urn:res:api:protected',
    adapters: {
      mock: mockAdapter(),
    },
    defaultAdapter: 'mock',
    grantEntitlement: entitlement.cookie({ ttlSeconds: 3600 }),
  },
  async () => {
    return Response.json({
      secret: 'This is the protected data!',
      timestamp: new Date().toISOString(),
    });
  }
);
