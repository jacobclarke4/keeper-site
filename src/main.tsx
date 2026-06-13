import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Fraunces with its FULL variable axes (wght · opsz · SOFT · WONK) — the
// masthead and display type lean on the optical-size and wonk axes.
import '@fontsource-variable/fraunces/full.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
// EB Garamond italics are the free fallback for Garamond Premier Pro accent words.
import '@fontsource/eb-garamond/400-italic.css'
import '@fontsource/eb-garamond/500-italic.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
