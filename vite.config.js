import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', '@supabase/supabase-js', 'react-router-dom', 'recharts']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})