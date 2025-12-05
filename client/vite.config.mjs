import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const { PORT = 4000 } = process.env

export default defineConfig({
  plugins: [react()],
  base: '/',  // served at root by Express
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
      '/auth': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    emptyOutDir: true,
    outDir: '../dist',
  },
})
