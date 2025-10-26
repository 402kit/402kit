# @402kit/core

## 0.1.3

### Patch Changes

- **Security fixes:**
  - Replace Math.random() with Web Crypto API (crypto.getRandomValues) for cryptographically secure nonce and UUID generation
  - Add strict header validation: 4096-byte limit, CRLF injection protection
  - Sanitize error messages to prevent information disclosure
