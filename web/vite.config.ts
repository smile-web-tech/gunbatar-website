import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  // Deployed under the site root on cPanel; change to '/subfolder/' if served from a subdir.
  base: '/',
  server: {
    proxy: apiProxy(),
    host: true,
    port: 5180,
    strictPort: true,
    allowedHosts: ['.ngrok-free.dev', '.ngrok.io', '.trycloudflare.com'],
  },
  preview: {
    proxy: apiProxy(),
    host: true,
    port: 5181,
    strictPort: true,
    allowedHosts: ['.ngrok-free.dev', '.ngrok.io', '.trycloudflare.com'],
  },
})

/**
 * Forward /api to the local PHP API during dev/preview. The leading `/api` is
 * stripped so `/api/media` -> `/media` and `/api/uploads/x` -> `/uploads/x`
 * (served straight off disk by the PHP dev server). In production the frontend
 * and API are same-origin under /api, so no proxy is involved.
 */
function apiProxy() {
  return {
    '/api': {
      target: process.env.VITE_API_TARGET ?? 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (p: string) => p.replace(/^\/api/, ''),
    },
  }
}
