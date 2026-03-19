import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Configure build output directory as 'frontend'
  build: {
    outDir: 'frontend',
  },
  server: {
    port: 3009,
    proxy: {
      '/ai': {
        target: 'https://api.openai.com/',
        secure: false,
        rewrite: (path) => path.replace(/^\/ai/, ''),
      },
    },
  },
  esbuild: {
	  // drop: ['console', 'debugger'],
  },
  plugins: [react()],
})
