import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// The site used to offer a dark mode; drop the old saved preference.
try {
  localStorage.removeItem('theme-preference')
} catch {
  // localStorage can be unavailable (privacy mode); nothing to clean up.
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
