import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Ledger is the whole type system — display, body, UI, and the italic accent,
// normalized to one family. It ships upright-only at weight 400, so heavier
// weights and italics render synthesized by the browser. (IBM Plex Mono is
// retired: the mono all-caps label was the broadsheet tell.)
import '@fontsource/ledger/400.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
