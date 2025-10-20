import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/express.ts', 'src/next.ts', 'src/hono.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
});
