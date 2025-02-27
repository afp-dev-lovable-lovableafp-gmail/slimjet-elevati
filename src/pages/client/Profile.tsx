import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ProfileSection } from "@/components/client/profile";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8">
          <div className="flex items-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Carregando...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <Helmet>
        <title>ElevaTI - Meu Perfil</title>
        <meta name="description" content="Gerencie suas informações de perfil na ElevaTI." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <ProfileSection />
      </div>
    </>
  );
};

export default Profile;
