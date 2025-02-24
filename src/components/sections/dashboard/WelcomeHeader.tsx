
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { Profile } from "@/types/auth";

interface WelcomeHeaderProps {
  profile: Profile | null;
  onSignOut: () => void;
}

export const WelcomeHeader = ({ profile, onSignOut }: WelcomeHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/10">
          <AvatarImage src={profile?.avatar_url || ''} />
          <AvatarFallback>
            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo(a), {profile?.full_name}
          </h1>
          <p className="text-gray-600">
            Gerencie seus agendamentos e seus dados
          </p>
        </div>
      </div>
      <Button
        onClick={onSignOut}
        variant="outline"
        className="mt-4 md:mt-0 flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </div>
  );
};
