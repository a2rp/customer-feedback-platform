import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/customer-feedback-platform/',
  build: { sourcemap: false },
  plugins: [react()],
})
