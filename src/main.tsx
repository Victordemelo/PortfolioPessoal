import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// Fontes servidas pelo próprio site (sem Google Fonts): só baixa o alfabeto usado
import '@fontsource-variable/ibm-plex-sans/standard.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
