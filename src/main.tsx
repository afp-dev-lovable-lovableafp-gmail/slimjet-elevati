
import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

// Criar uma instância do QueryClient
const queryClient = new QueryClient()

// Get the container element
const container = document.getElementById('root')
if (!container) {
  throw new Error('Failed to find the root element')
}

// Create a root
const root = createRoot(container)

// Render app
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
