import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// Served from GitHub Pages at jacobclarke4.github.io/keeper-site/ until a
// Keeper domain is attached. Set VITE_BASE='/' (and add public/CNAME) for a
// custom domain; the prerender step derives the base from the built assets.
const base = process.env.VITE_BASE ?? '/keeper-site/'

export default defineConfig({
  plugins: [react(), svgr()],
  base,
})
