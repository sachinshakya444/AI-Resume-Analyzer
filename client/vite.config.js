import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      events: 'rollup-plugin-node-polyfills/polyfills/events'
    }
  },
  optimizeDeps: {
    exclude: ['mongoose']
  }
})