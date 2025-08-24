import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,           // Frontend runs here
    proxy: {
      // Proxy API calls to your backend
      '/api': {
        target: 'http://localhost:3001', // Backend server.js
        changeOrigin: true,
        secure: false
      }
    }
  }
})
