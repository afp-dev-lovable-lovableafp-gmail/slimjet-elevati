import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate,
  Outlet
} from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'sonner';
import { HelmetProvider } from "react-helmet-async";
import Auth from './pages/Auth';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Team from './pages/Team';
import NotFound from './pages/NotFound';
import Dashboard from './pages/client/Dashboard';
import Profile from './pages/client/Profile';
import Booking from './pages/client/Booking';
import Appointments from './pages/client/Appointments';
import { useAuth } from './hooks/useAuth';
import { Suspense, lazy } from 'react';
import { ClientLayout } from '@/components/client/layout';
import { supabase } from '@/lib/supabase';

// Componente para rotas protegidas (autenticadas)
const ProtectedLayout = () => {
  const { loading, authenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

// Layout padrão para páginas públicas
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Outlet />
    </div>
  );
};

// Helper de redirecionamento
function redirect(to) {
  return { redirect: to };
}

// Definição de rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'team',
        element: <Team />,
      },
    ]
  },
  {
    path: '/auth',
    element: <Auth />,
    loader: async () => {
      // Se o usuário já estiver logado, redirecionar para o dashboard
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        return redirect('/client/dashboard');
      }
      return null;
    }
  },
  {
    path: '/client',
    element: <ProtectedLayout />,
    errorElement: <Navigate to="/auth" replace />,
    children: [
      {
        path: '',
        element: <ClientLayout />,
        children: [
          { 
            path: 'dashboard', 
            element: <Dashboard />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'booking',
            element: <Booking />,
          },
          {
            path: 'appointments',
            element: <Appointments />,
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
