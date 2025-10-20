import express from 'express';
import { express402 } from '@402kit/server/express';
import { mockAdapter } from '@402kit/adapter-mock';
import { entitlement } from '@402kit/entitlement';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for browser example
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-PAYMENT');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Public endpoint (no payment required)
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to 402Kit Express Example',
    endpoints: {
      public: '/',
      protected: '/api/protected',
      article: '/api/article/123',
    },
  });
});

// Protected endpoint with 402 payment requirement
app.get(
  '/api/protected',
  express402({
    price: async () => ({
      scheme: 'exact',
      network: 'evm:base:sepolia',
      asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC on Base Sepolia
      maxAmountRequired: '1000', // 1000 smallest units
      description: 'Access to protected resource',
    }),
    resource: (req) => `urn:res:${req.path}`,
    adapters: {
      mock: mockAdapter(),
    },
    defaultAdapter: 'mock',
    grantEntitlement: entitlement.cookie({ ttlSeconds: 3600 }),
  }),
  (_req, res) => {
    res.json({
      secret: 'This is the protected data!',
      timestamp: new Date().toISOString(),
    });
  }
);

// Article endpoint with per-article pricing
app.get(
  '/api/article/:id',
  express402({
    price: async (req) => ({
      scheme: 'exact',
      network: 'evm:base:sepolia',
      asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      maxAmountRequired: '500',
      description: `Access to article ${req.params.id}`,
    }),
    resource: (req) => `urn:article:${req.params.id}`,
    adapters: {
      mock: mockAdapter(),
    },
    defaultAdapter: 'mock',
    grantEntitlement: entitlement.cookie({ ttlSeconds: 86400 }), // 24h access
  }),
  (req, res) => {
    const articleId = req.params.id;
    res.json({
      id: articleId,
      title: `Article ${articleId}`,
      content: 'This is premium content available after payment.',
      author: '402Kit Team',
      publishedAt: new Date().toISOString(),
    });
  }
);

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
  console.log(`Try accessing: http://localhost:${PORT}/api/protected`);
});
