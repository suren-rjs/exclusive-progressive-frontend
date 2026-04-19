import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { TopicProvider } from './context/TopicContext'
import { NotificationProvider } from './context/NotificationContext'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <TopicProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </TopicProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)