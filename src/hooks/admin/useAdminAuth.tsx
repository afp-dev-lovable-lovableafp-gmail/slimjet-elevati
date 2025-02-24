
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const useAdminAuth = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.log("Usuário não autenticado, redirecionando...");
      navigate("/admin-auth", { replace: true });
    } else if (!loading && user && !profile?.is_admin) {
      console.log("Usuário não é admin, redirecionando...");
      navigate("/", { replace: true });
    }
  }, [user, profile, loading, navigate]);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isAdmin: !!profile?.is_admin
  };
};
