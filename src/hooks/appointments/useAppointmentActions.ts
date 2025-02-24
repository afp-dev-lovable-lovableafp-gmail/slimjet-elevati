
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { appointmentSchema, type AppointmentFormData } from "@/validations/schemas";
import { logger } from "@/utils/logger";

export const useAppointmentActions = (userId?: string) => {
  const queryClient = useQueryClient();
  const MODULE = 'appointments';

  const createAppointment = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      logger.info(MODULE, 'Creating new appointment', { 
        userId, 
        serviceId: data.service_id,
        scheduledAt: data.scheduled_at
      });
      
      try {
        // Validate the input data
        const validatedData = appointmentSchema.parse(data);

        const { error } = await supabase
          .from('appointments')
          .insert({
            ...validatedData,
            scheduled_at: validatedData.scheduled_at // Ensure this is included
          });

        if (error) throw error;

        logger.info(MODULE, 'Appointment created successfully', { 
          userId, 
          serviceId: data.service_id,
          scheduledAt: data.scheduled_at 
        });
      } catch (error) {
        logger.error(MODULE, 'Failed to create appointment', error as Error, {
          userId,
          serviceId: data.service_id
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', userId] });
      toast.success("Agendamento realizado com sucesso!");
    },
    onError: (error: Error) => {
      if (error.name === 'ZodError') {
        toast.error("Dados inválidos no formulário");
      } else {
        toast.error("Erro ao criar agendamento");
      }
    }
  });

  const updateAppointment = useMutation({
    mutationFn: async (data: Partial<AppointmentFormData> & { id: string }) => {
      logger.info(MODULE, 'Updating appointment', { 
        appointmentId: data.id,
        userId 
      });

      try {
        const partialSchema = appointmentSchema.partial();
        const validatedData = partialSchema.parse(data);
        const updateData = { ...validatedData };
        delete (updateData as any).id; // Remove id from update data

        const { error } = await supabase
          .from('appointments')
          .update(updateData)
          .eq('id', data.id);

        if (error) throw error;

        logger.info(MODULE, 'Appointment updated successfully', {
          appointmentId: data.id,
          userId
        });
      } catch (error) {
        logger.error(MODULE, 'Failed to update appointment', error as Error, {
          appointmentId: data.id,
          userId
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', userId] });
      toast.success("Agendamento atualizado com sucesso!");
    },
    onError: (error: Error) => {
      if (error.name === 'ZodError') {
        toast.error("Dados inválidos no formulário");
      } else {
        toast.error("Erro ao atualizar agendamento");
      }
    }
  });

  const cancelAppointment = useMutation({
    mutationFn: async (appointmentId: string) => {
      logger.info(MODULE, 'Canceling appointment', { 
        appointmentId,
        userId 
      });

      try {
        const { error } = await supabase
          .from('appointments')
          .update({ status: 'cancelled' as AppointmentStatus })
          .eq('id', appointmentId);

        if (error) throw error;

        logger.info(MODULE, 'Appointment cancelled successfully', {
          appointmentId,
          userId
        });
      } catch (error) {
        logger.error(MODULE, 'Failed to cancel appointment', error as Error, {
          appointmentId,
          userId
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', userId] });
      toast.success("Agendamento cancelado com sucesso!");
    },
    onError: (error: Error) => {
      logger.error(MODULE, 'Error canceling appointment', error as Error);
      toast.error("Erro ao cancelar agendamento");
    }
  });

  return {
    createAppointment,
    updateAppointment,
    cancelAppointment
  };
};
