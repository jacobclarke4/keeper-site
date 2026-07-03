import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// Served at the custom domain root (outcomeco.ai); the github.io URL
// redirects there once the Pages custom domain is set.
const base = '/'  // served at the custom domain root (outcomeco.ai)

export default defineConfig({
  plugins: [react(), svgr()],
  base,
})
