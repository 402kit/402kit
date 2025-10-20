# Express Example

This example demonstrates how to use 402Kit with Express.js.

## Setup

```bash
pnpm install
```

## Run

```bash
pnpm dev
```

The server will start on http://localhost:3000

## Try it out

### 1. Access public endpoint

```bash
curl http://localhost:3000/
```

### 2. Access protected endpoint (will get 402)

```bash
curl http://localhost:3000/api/protected
```

You'll receive a 402 Payment Required response with a challenge in the body.

### 3. Use the client to automatically handle 402

See the browser example for a full client implementation.

## Endpoints

- `GET /` - Public endpoint
- `GET /api/protected` - Protected endpoint requiring payment
- `GET /api/article/:id` - Per-article payment
