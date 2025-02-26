
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const useAdminAuth = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading) {
        if (!user) {
          navigate("/admin-auth", { replace: true });
          return;
        }

        // Wait for profile to load
        if (!profile) {
          return;
        }

        const isAdmin = profile.is_admin ?? false;
        
        if (!isAdmin) {
          navigate("/", { replace: true });
          return;
        }
      }
    };

    checkAuth();
  }, [user, profile, loading, navigate]);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isAdmin: profile?.is_admin ?? false
  };
};
