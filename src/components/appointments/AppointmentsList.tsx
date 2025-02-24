import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Appointment } from "@/types/appointment";
import { cn } from "@/lib/utils";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

const statusTranslations: Record<Appointment['status'], string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  completed: "Concluído",
};

const statusStyles: Record<Appointment['status'], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const AppointmentsList = () => {
  const { toast } = useToast();
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      // Primeiro busca os agendamentos
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .order("scheduled_at", { ascending: true });

      if (appointmentsError) throw appointmentsError;

      // Para cada agendamento, busca os dados relacionados
      const fullAppointments = await Promise.all(
        appointmentsData.map(async (appointment) => {
          // Busca os dados do serviço
          const { data: serviceData, error: serviceError } = await supabase
            .from("services")
            .select("*")
            .eq("id", appointment.service_id)
            .single();

          if (serviceError) throw serviceError;

          // Busca os dados do perfil
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("id, full_name, company_name")
            .eq("id", appointment.user_id)
            .single();

          if (profileError) {
            console.error("Erro ao buscar perfil:", profileError);
            return {
              ...appointment,
              services: serviceData,
              profiles: {
                id: appointment.user_id,
                full_name: null,
                company_name: null
              }
            };
          }

          return {
            ...appointment,
            services: serviceData,
            profiles: profileData
          };
        })
      );

      return fullAppointments as Appointment[];
    },
  });

  const cancelAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Agendamento cancelado com sucesso",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao cancelar agendamento",
        description: "Tente novamente mais tarde",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!appointments?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Você ainda não tem agendamentos</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id}>
          <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {appointment.services.name}
                </h3>
                <p className="text-gray-600">
                  {format(new Date(appointment.scheduled_at), "PPP 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-sm",
                    statusStyles[appointment.status]
                  )}
                >
                  {statusTranslations[appointment.status]}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Valor: R$ {appointment.services.price.toFixed(2)}
              </p>
              <div className="flex gap-2">
                {appointment.status === "pending" && (
                  <Button
                    variant="destructive"
                    onClick={() => cancelAppointment(appointment.id)}
                  >
                    Cancelar
                  </Button>
                )}
                {appointment.status === "completed" && (
                  <Button
                    variant="outline"
                    onClick={() => setShowFeedback(appointment.id)}
                  >
                    Avaliar
                  </Button>
                )}
              </div>
            </div>
            {appointment.notes && (
              <p className="text-sm text-gray-600">
                <strong>Observações:</strong> {appointment.notes}
              </p>
            )}
            {appointment.meeting_url && (
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <a href={appointment.meeting_url} target="_blank" rel="noopener noreferrer">
                  Acessar Reunião
                </a>
              </Button>
            )}
          </div>
          
          {showFeedback === appointment.id && (
            <div className="mt-4">
              <FeedbackForm 
                appointmentId={appointment.id}
                onSuccess={() => setShowFeedback(null)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AppointmentsList;
