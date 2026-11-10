import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Toasts from './components/toast/Toasts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
 import "./assets/styles/globals.css";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
      <Toasts />
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
