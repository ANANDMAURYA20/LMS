import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase the chunk size warning limit (in kibibytes)
    chunkSizeWarningLimit: 1000, // Default is usually around 500
  }
})
