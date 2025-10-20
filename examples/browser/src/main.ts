import { createClient } from '@402kit/client';
import { mockAdapter } from '@402kit/adapter-mock';

// Create 402-aware client
const client = createClient({
  adapters: {
    mock: mockAdapter(),
  },
  resolvePayment: async (challenge, ctx) => {
    log(`Received 402 challenge for: ${challenge.resource}`);
    log(`Amount: ${challenge.maxAmountRequired} (atomic units)`);
    log(`Network: ${challenge.network}`);

    const adapter = ctx.getAdapter('mock');
    const payment = await adapter.initiate(challenge, ctx);

    log('Payment resolved, retrying request...');
    return payment;
  },
  onPaymentRequired: (challenge) => {
    log('Payment required!');
    log(JSON.stringify(challenge, null, 2));
  },
  onVerified: (response) => {
    log('Payment verified!');
    log(JSON.stringify(response, null, 2));
  },
});

// UI setup
const btn = document.getElementById('fetchBtn') as HTMLButtonElement;
const endpointSelect = document.getElementById('endpoint') as HTMLSelectElement;
const logDiv = document.getElementById('log') as HTMLDivElement;
const logContent = document.getElementById('logContent') as HTMLPreElement;

function log(message: string) {
  const timestamp = new Date().toISOString();
  logContent.textContent += `[${timestamp}] ${message}\n`;
  logDiv.style.display = 'block';
}

btn.addEventListener('click', async () => {
  btn.disabled = true;
  logContent.textContent = '';
  logDiv.style.display = 'none';

  try {
    const endpoint = endpointSelect.value;
    log(`Fetching protected resource: ${endpoint}`);

    const response = await client.fetch(endpoint);

    log(`Response status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      log('Success! Received data:');
      log(JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      log(`Error: ${text}`);
    }
  } catch (error) {
    log(`Error: ${error}`);
  } finally {
    btn.disabled = false;
  }
});

// Initial log
log('Client ready. Click the button to test!');
