import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const nationalAddressProxy = {
    target: 'https://dkhoonemirates.com',
    changeOrigin: true,
    secure: true,
    rewrite: (requestPath: string) =>
      requestPath.replace(/^\/api\/national-address/, '/api/v1/locations/national-address'),
  };

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {
              ignored: ['**/.local/**', '**/.cache/**', '**/dist/**'],
            },
      proxy: {
        '/api/national-address': nationalAddressProxy,
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      allowedHosts: true as const,
      proxy: {
        '/api/national-address': nationalAddressProxy,
      },
    },
  };
});
