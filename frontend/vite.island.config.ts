import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** Embeddable bundle for static index.html (#cafes-root). */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../assets/cafes-island'),
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/cafes-island.tsx'),
      output: {
        entryFileNames: 'cafes-island.js',
        assetFileNames: 'cafes-island.[ext]',
      },
    },
  },
});
