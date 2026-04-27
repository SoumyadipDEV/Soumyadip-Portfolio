import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'

import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              'border border-slate-200 bg-white text-navy dark:border-navy-lighter dark:bg-navy-light dark:text-white',
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
