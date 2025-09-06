import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',      // This is critical!
    port: 5173,
    strictPort: true,
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled', 'react', 'react-dom'],
    exclude: ['@rollup/rollup-win32-x64-msvc'], // Exclude problematic native module
  },
  resolve: {
    alias: {
      '@emotion/styled': '@emotion/styled',
    },
  },
});
