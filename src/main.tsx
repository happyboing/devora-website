import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource-variable/inter'
import '@fontsource-variable/space-grotesk'
import './index.css'

import App from '@/App'
import { PreloaderDismiss } from '@/components/layout/PreloaderDismiss'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Devora: root container "#root" was not found in the document.')
}

createRoot(container).render(
  <StrictMode>
    <PreloaderDismiss />
    <App />
  </StrictMode>,
)
