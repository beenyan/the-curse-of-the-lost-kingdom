import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
      '~': path.resolve(__dirname, '/node_modules'),
    },
  },
  build: {
    outDir: './backend/dist',
  },
  server: {
    port: 8080,
    open: true,
    https: true,
    ssr: true,
    proxy: {
      '/manageapi': {
        target: 'https://localhost',
        changeOrigin: false,
        secure: false,
      },
      '/api': {
        target: 'https://localhost',
        changeOrigin: false,
        secure: false,
      },
    },
  },
  css: { preprocessorOptions: { scss: { charset: false } } },
});
