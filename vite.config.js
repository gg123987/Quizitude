import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',               // Simulate a browser environment for React components
    include: ['src/**/*.test.{js,ts,jsx,tsx}'],
    setupFiles: './src/setupTests.js',
    coverage: {
      reporter: ['text', 'json'],
    },
  }
});