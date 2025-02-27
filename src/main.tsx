
import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { Toaster } from 'sonner';

// Criar uma instância do QueryClient com configuração mais tolerante a erros
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
})

// Get the container element
const container = document.getElementById('root')
if (!container) {
  throw new Error('Failed to find the root element')
}

// Create a root
const root = createRoot(container)

// Render app com tratamento de erros
try {
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-right" richColors closeButton />
      </QueryClientProvider>
    </React.StrictMode>
  )
} catch (error) {
  console.error("Erro crítico ao renderizar a aplicação:", error);
  
  // Renderizar uma mensagem de erro para o usuário
  root.render(
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Erro ao iniciar aplicação</h1>
        <p className="mb-6 text-gray-600">
          Ocorreu um problema ao carregar a aplicação. Por favor, tente novamente em alguns instantes
          ou entre em contato com o suporte.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        >
          Recarregar
        </button>
      </div>
    </div>
  );
}
