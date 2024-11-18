// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // Tarmoqdan kirishga ruxsat berish
    port: 5173,         // Portni belgilash (5173 default)
    proxy: {
      '/api': {
        target: 'https://api.mirmakhmudoff.uz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
