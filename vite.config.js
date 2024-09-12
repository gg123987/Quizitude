import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', 
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',               // Simulate a browser environment for React components
    setupFiles: './src/setupTests.js',
    coverage: {
      reporter: ['text', 'json'],
    },
  }
});