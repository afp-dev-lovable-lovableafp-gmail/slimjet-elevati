import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Appointment } from "@/types/appointment";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { AppointmentItem } from "./AppointmentItem";

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
          <AppointmentItem
            appointment={appointment}
            onCancel={cancelAppointment}
            onFeedback={(id) => setShowFeedback(id)}
          />
          
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
