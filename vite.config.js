import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // En GitHub Pages el sitio vive bajo /teyvat-atlas/; en local sigue siendo /
  base: process.env.GITHUB_ACTIONS ? '/teyvat-atlas/' : '/',
  plugins: [react()],
  server: {
    port: 5178,
  },
});
