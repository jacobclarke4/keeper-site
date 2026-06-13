import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// One repo, two deploy targets — the base path differs, so pick it per repo at
// build time from GITHUB_REPOSITORY_OWNER (set automatically by GitHub Actions):
//   - Production: Fortifai-Labs/outcome-site -> custom domain theoutcome.ai (root) -> '/'
//   - Staging:    outcome-os/outcome-site    -> outcome-os.github.io/outcome-site/ -> '/outcome-site/'
// The router reads import.meta.env.BASE_URL, so path routing + the 404.html SPA
// fallback adapt automatically to whichever base is built. Local dev/build with
// no owner set falls back to the staging path.
const owner = (process.env.GITHUB_REPOSITORY_OWNER ?? '').toLowerCase()
const base = owner === 'fortifai-labs' ? '/' : '/outcome-site/'

export default defineConfig({
  plugins: [react(), svgr()],
  base,
})
