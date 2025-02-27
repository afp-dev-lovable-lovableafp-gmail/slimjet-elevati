import { BackButton } from "@/components/ui/back-button";
import { useProfileForm } from "@/hooks/profile/useProfileForm";
import ProfileForm from "./ProfileForm";

const ProfileSection = () => {
  const { profile, isLoading, updateProfile } = useProfileForm();

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <BackButton />
        </div>
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