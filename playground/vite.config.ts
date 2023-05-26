import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import resolveEnhance from '..';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    resolveEnhance({
      env: 'overseas',
      root: process.cwd(),
    }),
    vue(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
  },
});
