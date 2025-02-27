
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useProfileForm } from "@/hooks/profile/useProfileForm";

const ProfileSection = () => {
  const navigate = useNavigate();
  const { profile, isLoading, updateProfile } = useProfileForm();

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </button>
        <ProfileForm 
          initialData={profile} 
          onSubmit={updateProfile} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default ProfileSection;
