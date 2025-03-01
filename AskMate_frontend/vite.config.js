import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const apiUrl = import.meta.env.VITE_API_URL;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `${apiUrl}`,
        changeOrigin: true,
        secure: false, // Set to true if using HTTPS
        rewrite: (path) => path.replace(/^\/api/, '') // Adjust if necessary
      }
    }
  }
})
