// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {APIProvider} from '@vis.gl/react-google-maps';
import { AuthProvider } from './components/auth/AuthContext.tsx';

const KEY = import.meta.env.VITE_GOOGLE_MAP_API;


createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <APIProvider apiKey={KEY}>
      <App />
    </APIProvider>
    </AuthProvider>
)
