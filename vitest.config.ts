import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    alias: {
      '@': path.resolve(__dirname, './'),
    },
    include: ['./__tests__/**/*.test.(ts|tsx)'],
  },
})
