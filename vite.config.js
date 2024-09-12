import { defineConfig } from 'vite';
import { ViteTestPlugin } from 'vitest';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    ViteTestPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',               // Simulate a browser environment for React components
    include: ['**/*.test.jsx', '**/*.test.js'],
    setupFiles: './tests/setupTests.js', // Setup file
    coverage: {
      reporter: ['text', 'json'],
    },
  }
});