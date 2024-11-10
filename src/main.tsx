import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router-dom'
import { router } from './router/router.tsx'
import { StoreProvider } from './providers/ReduxProvider.tsx'
import { AuthProvider } from './providers/AuthProvider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {/* we wappe all app with redux provider */}
        <StoreProvider>
          <RouterProvider router={router} />
        </StoreProvider>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
