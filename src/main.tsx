import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// EB Garamond is the whole type system now — display, body, and the italic
// accent, normalized to one family. Upright weights for headings/body/UI,
// italics for the signature accent words.
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
