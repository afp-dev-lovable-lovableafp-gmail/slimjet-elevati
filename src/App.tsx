
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Team from './pages/Team';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import AdminAuth from './pages/AdminAuth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Appointments from './pages/Appointments';
import Booking from './pages/Booking';
import ManagerAdmin from './pages/ManagerAdmin';
import CustomFields from './pages/manager-admin/CustomFields';
import DocumentTemplates from './pages/manager-admin/DocumentTemplates';
import CustomMetrics from './pages/manager-admin/CustomMetrics';
import CustomReports from './pages/manager-admin/CustomReports';
import Analytics from './pages/manager-admin/Analytics';
import { default as AdminServices } from './pages/manager-admin/Services';
import TeamMembers from './pages/manager-admin/TeamMembers';
import AdminAppointments from './pages/manager-admin/Appointments';
import Settings from './pages/manager-admin/Settings';
import Users from './pages/manager-admin/Users';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/servicos" element={<Services />} />
        <Route path="/time" element={<Team />} />
        
        {/* Authentication Routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin-auth" element={<AdminAuth />} />
        
        {/* User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/agendamentos" element={<Appointments />} />
        <Route path="/agendar" element={<Booking />} />
        
        {/* Admin Routes */}
        <Route path="/manager-admin" element={<ManagerAdmin />} />
        <Route path="/manager-admin/campos-personalizados" element={<CustomFields />} />
        <Route path="/manager-admin/modelos-documentos" element={<DocumentTemplates />} />
        <Route path="/manager-admin/metricas-personalizadas" element={<CustomMetrics />} />
        <Route path="/manager-admin/relatorios-personalizados" element={<CustomReports />} />
        <Route path="/manager-admin/analytics" element={<Analytics />} />
        <Route path="/manager-admin/servicos" element={<AdminServices />} />
        <Route path="/manager-admin/time" element={<TeamMembers />} />
        <Route path="/manager-admin/agendamentos" element={<AdminAppointments />} />
        <Route path="/manager-admin/configuracoes" element={<Settings />} />
        <Route path="/manager-admin/usuarios" element={<Users />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
