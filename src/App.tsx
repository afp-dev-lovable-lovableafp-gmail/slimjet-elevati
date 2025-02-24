
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Team from "@/pages/Team";
import Contact from "@/pages/Contact";
import Auth from "@/pages/Auth";
import AdminAuth from "@/pages/AdminAuth";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import ManagerAdmin from "@/pages/ManagerAdmin";
import NotFound from "@/pages/NotFound";
import Appointments from "@/pages/Appointments";
import Booking from "@/pages/Booking";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/time" element={<Team />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/manager-admin/*" element={<ManagerAdmin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
