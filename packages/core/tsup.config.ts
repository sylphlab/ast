import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Entry point
  format: ['cjs', 'esm'], // Output formats: CommonJS and ESModule
  dts: true, // Generate declaration files (.d.ts)
  splitting: false, // Disable code splitting for libraries
  sourcemap: true, // Generate sourcemaps
  clean: true, // Clean output directory before build
});