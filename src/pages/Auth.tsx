
import { ClientAuthForm } from "@/components/auth/ClientAuthForm";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const { authenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar se há um redirecionamento de origem
  const from = location.state?.from?.pathname || "/client/dashboard";

  // Redirecionar para o dashboard se já estiver autenticado
  useEffect(() => {
    if (authenticated && !loading) {
      navigate(from, { replace: true });
    }
  }, [authenticated, loading, navigate, from]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ClientAuthForm />
    </div>
  );
};

export default Auth;
