import { Helmet } from "react-helmet";
import ProfileSection from "@/components/sections/ProfileSection";

const Profile = () => {
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
