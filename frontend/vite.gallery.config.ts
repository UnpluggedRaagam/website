import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** Embeddable bundle for static gallery.html (#gallery-root). */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../assets/gallery-island'),
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/gallery-island.tsx'),
      output: {
        entryFileNames: 'gallery-island.js',
        assetFileNames: 'gallery-island.[ext]',
      },
    },
  },
});
