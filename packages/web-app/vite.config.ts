import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      src: '/src',
    },
  },
  build: {
    outDir: './build',
  },
})
