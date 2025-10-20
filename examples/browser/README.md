# Browser Example

This example demonstrates how to use 402Kit client in a browser.

## Setup

```bash
pnpm install
```

## Run

First, start the Express or Next.js server:

```bash
cd ../express
pnpm dev
```

Then in a new terminal, start the browser example:

```bash
pnpm dev
```

Visit http://localhost:5173

## Usage

Click the "Fetch Protected Resource" button. The client will:

1. Make a request to the protected endpoint
2. Receive a 402 Payment Required response
3. Automatically resolve the payment via the mock adapter
4. Retry the request with the X-PAYMENT header
5. Display the protected data

All steps are logged in the UI.
