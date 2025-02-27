
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookingCTA = () => {
  return (
    <Card className="mt-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-blue-800">Agende uma consulta</CardTitle>
        <CardDescription className="text-blue-700">
          Fale com nossos especialistas e resolva seus problemas de TI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
              <div>
                <h4 className="font-medium text-blue-800">Escolha a data</h4>
                <p className="text-sm text-blue-700">Selecione o melhor dia para você</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
              <div>
                <h4 className="font-medium text-blue-800">Horário flexível</h4>
                <p className="text-sm text-blue-700">Encontre um horário que se adapte à sua rotina</p>
              </div>
            </div>
          </div>
          <div className="flex items-center self-end sm:self-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/client/booking">
                Agendar agora
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCTA;
