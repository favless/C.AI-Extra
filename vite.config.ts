import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'


export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: 'src/content.ts',
      output: {
        entryFileNames: 'content.js',
      },
    },
  },
})
