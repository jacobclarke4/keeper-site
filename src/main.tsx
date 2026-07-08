import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// The app's four type voices (apps/web): Ledger for display, Switzer for
// prose (self-hosted in public/fonts via @font-face in 01-base.css),
// IBM Plex Mono for eyebrows/micro-labels, and EB Garamond italic for the
// blue accent turns (the free stand-in for Garamond Premier Pro).
import '@fontsource/ledger/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/eb-garamond/400-italic.css'
import '@fontsource/eb-garamond/500-italic.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
