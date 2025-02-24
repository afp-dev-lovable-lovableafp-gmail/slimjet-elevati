
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminAuthSection from "@/components/sections/AdminAuthSection";

const AdminAuth = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AdminAuth useEffect:", {
      user,
      profile,
      loading,
      isAdmin: profile?.is_admin
    });
    
    // Só redireciona quando:
    // 1. Os dados não estão mais carregando (loading === false)
    // 2. Temos um usuário (user !== null)
    // 3. Temos um perfil carregado (profile !== null)
    if (!loading && user && profile) {
      if (profile.is_admin) {
        console.log("Redirecionando admin para /manager-admin");
        navigate("/manager-admin", { replace: true });
      } else {
        console.log("Usuário não é admin, redirecionando para /");
        navigate("/", { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  // Se estiver carregando, mostra o formulário normalmente
  return (
    <>
      <Helmet>
        <title>ElevaTI - Área Administrativa</title>
        <meta 
          name="description" 
          content="Acesso à área administrativa da ElevaTI" 
        />
      </Helmet>
      <AdminAuthSection />
    </>
  );
};

export default AdminAuth;
