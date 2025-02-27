
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/string';

interface WelcomeHeaderProps {
  name?: string | null;
  avatarUrl?: string | null;
}

const WelcomeHeader = ({ name, avatarUrl }: WelcomeHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex items-center mb-4 sm:mb-0">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={avatarUrl || undefined} alt={name || 'Cliente'} />
          <AvatarFallback>{getInitials(name || 'Cliente')}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">Bem-vindo, {name || 'Cliente'}</h1>
          <p className="text-gray-600">Acompanhe seus agendamentos e dados</p>
        </div>
      </div>
      <Button asChild>
        <Link to="/schedule">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Agendar Consulta
        </Link>
      </Button>
    </div>
  );
};

export default WelcomeHeader;
