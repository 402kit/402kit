import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/*.test.ts'],
    },
  },
  resolve: {
    alias: {
      // Map workspace packages to their source directories for testing
      '@402kit/core': resolve(__dirname, 'packages/core/src/index.ts'),
      '@402kit/client': resolve(__dirname, 'packages/client/src/index.ts'),
      '@402kit/server': resolve(__dirname, 'packages/server/src/index.ts'),
      '@402kit/entitlement': resolve(
        __dirname,
        'packages/entitlement/src/index.ts'
      ),
      '@402kit/adapter-mock': resolve(
        __dirname,
        'packages/adapter-mock/src/index.ts'
      ),
      '@402kit/adapter-x402': resolve(
        __dirname,
        'packages/adapter-x402/src/index.ts'
      ),
    },
    extensions: ['.ts', '.js', '.mts', '.mjs'],
  },
});
