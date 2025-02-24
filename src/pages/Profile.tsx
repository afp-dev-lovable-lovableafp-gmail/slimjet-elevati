
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ProfileSection from "@/components/sections/ProfileSection";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
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
      <ProfileSection />
    </>
  );
};

export default Profile;
