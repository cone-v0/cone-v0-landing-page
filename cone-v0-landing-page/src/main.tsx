import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Inter con ejes de peso y tamaño óptico (opsz 14 = Inter, opsz 32 = Inter Display)
import '@fontsource-variable/inter/opsz.css'
import '@fontsource/kode-mono/400.css'
import '@fontsource/kode-mono/500.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
