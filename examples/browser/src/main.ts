import { createClient } from '@402kit/client';
import { mockAdapter } from '@402kit/adapter-mock';

// Define challenge type inline for demo
interface PaymentChallenge {
  version: 'x402.v1';
  scheme: string;
  network: string;
  asset: string;
  payTo: string;
  maxAmountRequired: string;
  maxTimeoutSeconds: number;
  challengeId: string;
  bind: {
    host: string;
    method: string;
    path: string;
  };
  resource: string;
  meta?: {
    description?: string;
  };
}

// Mock server responses for demo purposes
const mockResponses: Record<string, { price: number; content: any }> = {
  'mock://protected': {
    price: 10000, // 0.01 USDC = 1 cent
    content: {
      message: 'Welcome to the protected resource!',
      secret: 'super-secret-data',
    },
  },
  'mock://article/123': {
    price: 5000, // 0.005 USDC = half a cent
    content: {
      id: 123,
      title: 'Introduction to HTTP 402',
      content: 'HTTP 402 Payment Required is a status code...',
    },
  },
  'mock://article/456': {
    price: 25000, // 0.025 USDC = 2.5 cents
    content: {
      id: 456,
      title: 'Advanced 402Kit Usage',
      content: 'Learn how to integrate 402Kit into your stack...',
    },
  },
  'mock://premium': {
    price: 100000, // 0.10 USDC = 10 cents
    content: {
      tier: 'premium',
      features: [
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
      ],
    },
  },
};

// Create a mock fetch that simulates 402 responses
const originalFetch = window.fetch;
const simulatedPayments = new Set<string>();

window.fetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.href
        : input.url;

  // Check if this is a mock URL
  if (url.startsWith('mock://')) {
    const config = mockResponses[url];
    if (!config) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
      });
    }

    // Check if payment was provided
    const paymentHeader =
      init?.headers && (init.headers as Record<string, string>)['X-PAYMENT'];

    if (!paymentHeader && !simulatedPayments.has(url)) {
      // Return 402 with challenge
      const challenge: PaymentChallenge = {
        version: 'x402.v1',
        scheme: 'exact',
        network: 'evm:base:sepolia',
        asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        payTo: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        maxAmountRequired: config.price.toString(),
        maxTimeoutSeconds: 60,
        challengeId: `challenge-${Date.now()}`,
        bind: {
          host: window.location.host,
          method: 'GET',
          path: url,
        },
        resource: url,
        meta: {
          description: `Access to ${url}`,
        },
      };

      return new Response(JSON.stringify(challenge), {
        status: 402,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Payment provided or already paid, return content
    simulatedPayments.add(url);
    return new Response(JSON.stringify(config.content), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-PAYMENT-RESPONSE': JSON.stringify({
          verified: true,
          timestamp: Date.now(),
        }),
      },
    });
  }

  // For non-mock URLs, use original fetch
  return originalFetch(input, init);
};

// Create 402-aware client
const client = createClient({
  adapters: {
    mock: mockAdapter(),
  },
  resolvePayment: async (challenge, ctx) => {
    log(`💰 Received 402 Payment Challenge`);
    log(`   Resource: ${challenge.resource}`);
    log(
      `   Amount: ${challenge.maxAmountRequired} atomic units (${parseInt(challenge.maxAmountRequired) / 1000000} USDC)`
    );
    log(`   Network: ${challenge.network}`);
    log(`   Challenge ID: ${challenge.challengeId}`);
    log('');

    const adapter = ctx.getAdapter('mock');
    log('🔄 Initiating mock payment...');
    const payment = await adapter.initiate(challenge, ctx);

    log('✅ Payment generated successfully');
    log('🔄 Retrying request with payment header...');
    log('');
    return payment;
  },
  onPaymentRequired: (_challenge) => {
    log('⚠️  Payment Required!');
  },
  onVerified: (response) => {
    log('✅ Payment Verified!');
    if (response) {
      log(`   Verification: ${JSON.stringify(response)}`);
    }
    log('');
  },
});

// UI setup
const btn = document.getElementById('fetchBtn') as HTMLButtonElement;
const endpointSelect = document.getElementById('endpoint') as HTMLSelectElement;
const logDiv = document.getElementById('log') as HTMLDivElement;
const logContent = document.getElementById('logContent') as HTMLPreElement;

function log(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  logContent.textContent += `[${timestamp}] ${message}\n`;
  logDiv.style.display = 'block';
  // Auto-scroll to bottom
  logContent.scrollTop = logContent.scrollHeight;
}

btn.addEventListener('click', async () => {
  btn.disabled = true;
  logContent.textContent = '';
  logDiv.style.display = 'none';

  try {
    const endpoint = endpointSelect.value;
    log(`🚀 Starting Request`);
    log(`   Endpoint: ${endpoint}`);
    log('');

    const response = await client.fetch(endpoint);

    log(`📥 Response Received`);
    log(`   Status: ${response.status} ${response.statusText}`);
    log('');

    if (response.ok) {
      const data = await response.json();
      log('🎉 Success! Content Received:');
      log('');
      log(JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      log(`❌ Error: ${text}`);
    }
  } catch (error) {
    log(`❌ Error: ${error}`);
  } finally {
    btn.disabled = false;
  }
});

// Initial state
log('✨ 402Kit Client Ready!');
log('');
log('Select a resource above and click the button to see the automatic');
log('HTTP 402 payment flow in action.');
log('');
log('═══════════════════════════════════════════════════════════════');
log('');
