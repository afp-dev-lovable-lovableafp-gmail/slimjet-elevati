
import { Route, Routes } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import AdminDashboard from "@/components/sections/admin/AdminDashboard";
import TeamMembers from "./manager-admin/TeamMembers";
import Services from "./manager-admin/Services";
import Analytics from "./manager-admin/Analytics";
import Users from "./manager-admin/Users";
import Settings from "./manager-admin/Settings";
import Appointments from "./manager-admin/Appointments";

const ManagerAdmin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/time" element={<TeamMembers />} />
        <Route path="/servicos" element={<Services />} />
        <Route path="/agendamentos" element={<Appointments />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/configuracoes" element={<Settings />} />
      </Routes>
    </AdminLayout>
  );
};

export default ManagerAdmin;
