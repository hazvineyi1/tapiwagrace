import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Absolute URLs for the social card, canonical and sitemap. Defaults to the
// live domain; override with SITE_ORIGIN for a staging build, or set it to an
// empty string to fall back to relative tags with no sitemap.
const DEFAULT_SITE_ORIGIN = 'https://www.tapiwanashegrace.com';
const siteOrigin = (process.env.SITE_ORIGIN ?? DEFAULT_SITE_ORIGIN).replace(
  /\/+$/,
  '',
);

const ROUTES = ['/', '/retreats', '/contact', '/privacy'];

function siteMetaPlugin() {
  return {
    name: 'site-meta',
    transformIndexHtml(html: string) {
      return html.split('%SITE_ORIGIN%').join(siteOrigin);
    },
    generateBundle(this: { emitFile: (f: { type: 'asset'; fileName: string; source: string }) => void }) {
      const robots = [
        'User-agent: *',
        'Allow: /',
        ...(siteOrigin ? ['', `Sitemap: ${siteOrigin}/sitemap.xml`] : []),
        '',
      ].join('\n');
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });

      if (!siteOrigin) return;
      const urls = ROUTES.map(
        (route) => `  <url><loc>${siteOrigin}${route}</loc></url>`,
      ).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    siteMetaPlugin(),
    ...(process.env.NODE_ENV !== 'production' &&
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
    // In production the platform router maps /api to the API service. In dev
    // the two run on separate ports, so proxy across.
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
