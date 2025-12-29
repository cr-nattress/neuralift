import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'domain/index': 'src/domain/index.ts',
    'ports/index': 'src/ports/index.ts',
    'services/index': 'src/services/index.ts',
    'use-cases/index': 'src/use-cases/index.ts',
    'config/index': 'src/config/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
});
