
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminAuthSection from "@/components/sections/AdminAuthSection";
import { logger } from "@/features/logging/logger";

const AdminAuth = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logger.info("auth", "AdminAuth useEffect:", {
      userId: user?.id,
      isAdmin: profile?.is_admin,
      loading
    });
    
    if (!loading && user && profile) {
      if (profile.is_admin) {
        logger.info("auth", "Redirecionando admin para /manager-admin");
        navigate("/manager-admin", { replace: true });
      } else {
        logger.info("auth", "Usuário não é admin, redirecionando para /");
        navigate("/", { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

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
