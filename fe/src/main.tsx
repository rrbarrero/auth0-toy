import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_DOMAIN}
      clientId={import.meta.env.VITE_CLIENT_ID}
      cacheLocation='localstorage'
      useRefreshTokens={false}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUDIENCE,
        scope: import.meta.env.VITE_SCOPE,
      }}>
      <App />
    </Auth0Provider>
    ,
  </StrictMode>,
)
