import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router-dom'
import { router } from './router/routes.tsx'
import { StoreProvider } from './providers/ReduxProvider.tsx'
import { AuthProvider } from './providers/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>

      {/* we wappe all app with redux provider */}
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </AuthProvider>
  </StrictMode>,
)
