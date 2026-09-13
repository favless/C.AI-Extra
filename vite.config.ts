import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: 'src/content.tsx',
      output: {
        entryFileNames: 'content.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'content.css'
          }

          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
})