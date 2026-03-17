import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import './lib/i18n'
import App from './App.jsx'

// Extract from env, fallback for typing if missing temporarily
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "347857792787-ghbdr7anqvbl1tj1ahvq5ipv6hu5mkpj.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
