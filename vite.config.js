import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      }
    }
  },
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  preview: {
    port: 4173,
    open: true
  }
});
