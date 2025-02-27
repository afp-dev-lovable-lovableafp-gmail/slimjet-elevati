
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarPlus, LogOut, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/string';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WelcomeHeaderProps {
  name?: string | null;
  avatarUrl?: string | null;
}

const WelcomeHeader = ({ name, avatarUrl }: WelcomeHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex items-center mb-4 sm:mb-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-12 w-12 mr-4 cursor-pointer">
                    <AvatarImage src={avatarUrl || undefined} alt={name || 'Cliente'} />
                    <AvatarFallback>{getInitials(name || 'Cliente')}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link to="/client/profile" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Editar Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clique para opções</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div>
          <h1 className="text-2xl font-bold">Bem-vindo, {name || 'Cliente'}</h1>
          <p className="text-gray-600">Acompanhe seus agendamentos e dados</p>
        </div>
      </div>
      <Button asChild>
        <Link to="/client/booking">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Agendar Consulta
        </Link>
      </Button>
    </div>
  );
};

export default WelcomeHeader;
