
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";
import ProfileFormFields from "./ProfileFormFields";
import { useProfileForm } from "@/hooks/profile/useProfileForm";
import type { FormProfile } from "@/types/profile";

const ProfileForm = () => {
  const {
    profile,
    loading,
    handleSubmit,
    handleProfileChange
  } = useProfileForm();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center space-y-4">
          <ProfileAvatar
            userId={profile.userId || ""}
            avatarUrl={profile.avatar_url || ""}
            fullName={profile.full_name}
            onAvatarUpdate={(url) => handleProfileChange({ ...profile, avatar_url: url })}
          />
          <CardTitle>Meu Perfil</CardTitle>
          <CardDescription>
            Mantenha seus dados atualizados
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ProfileFormFields
            profile={profile}
            onProfileChange={handleProfileChange}
          />
          <Button type="submit" className="w-full">
            Salvar Alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
