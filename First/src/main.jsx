import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Film from './Film.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Film />
  </StrictMode>,
)
