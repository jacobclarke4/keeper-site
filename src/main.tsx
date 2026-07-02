import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Ledger is the whole prose type system now — display, body, UI, and the
// italic accent, normalized to one family. It ships upright-only at weight 400,
// so heavier weights and italics render synthesized by the browser.
import '@fontsource/ledger/400.css'
// IBM Plex Mono stays for the small kicker/dateline/folio labels — a functional
// label face, not part of the normalized prose type.
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
