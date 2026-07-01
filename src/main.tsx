import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Ledger is the display face — the big broadsheet headings. EB Garamond
// carries body, UI, and the signature italic accent (Ledger ships upright-only,
// weight 400, so the true italic stays Garamond).
import '@fontsource/ledger/400.css'
import '@fontsource/eb-garamond/400.css'
import '@fontsource/eb-garamond/500.css'
import '@fontsource/eb-garamond/600.css'
import '@fontsource/eb-garamond/700.css'
import '@fontsource/eb-garamond/400-italic.css'
import '@fontsource/eb-garamond/500-italic.css'
import '@fontsource/eb-garamond/600-italic.css'
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
