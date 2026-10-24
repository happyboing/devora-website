import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

const root = import.meta.dirname

// GitHub Pages project sites are served from /<repo>/, so the deploy workflow
// sets BASE_PATH. Local dev/build and user/org sites (username.github.io) use '/'.
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
      '@assets': path.resolve(root, 'assets'),
    },
  },
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    chunkSizeWarningLimit: 1400,
  },
})
