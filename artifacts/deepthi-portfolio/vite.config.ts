import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import { previewRouting } from './tools/preview-routing';

export default defineConfig(async ({ command, isPreview }) => {
  const rawPort = process.env.PORT;
  if (command === 'serve' && process.env.REPL_ID && !rawPort) {
    throw new Error('Start the managed artifact workflow so PORT is provided.');
  }
  const port = rawPort ? Number(rawPort) : 5173;
  if (!Number.isInteger(port) || port <= 0 || port > 65535) throw new Error('PORT must be a valid TCP port.');
  // Builds are portable without a running service; managed workflows still
  // supply both values in Replit.
  const basePath = process.env.BASE_PATH || '/';
  return {
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    previewRouting(path.resolve(import.meta.dirname, 'dist/public'), basePath),
    ...(command === 'serve' && !isPreview ? [runtimeErrorOverlay()] : []),
    ...(command === 'serve' && !isPreview &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  };
});
