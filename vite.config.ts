import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/hoodwink/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
}))
