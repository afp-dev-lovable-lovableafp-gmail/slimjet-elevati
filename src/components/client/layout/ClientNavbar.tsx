import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/string";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

const ClientNavbar = () => {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/client/dashboard" className="flex items-center">
            <img src="/images/logo.png" alt="LogoTipo" className="h-10" />
            <span className="ml-2 text-lg font-bold text-gray-900">ElevaTI</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/client/dashboard" 
              className="text-gray-600 hover:text-primary transition"
            >
              Dashboard
            </Link>
            <Link 
              to="/client/appointments" 
              className="text-gray-600 hover:text-primary transition"
            >
              Agendamentos
            </Link>
            <Link 
              to="/client/booking" 
              className="text-gray-600 hover:text-primary transition"
            >
              Agendar
            </Link>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || user?.email} />
                  <AvatarFallback>{getInitials(profile?.full_name || "Usuário")}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/client/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default ClientNavbar; 