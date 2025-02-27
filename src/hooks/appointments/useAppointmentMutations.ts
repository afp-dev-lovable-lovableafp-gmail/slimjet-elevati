
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { handleError } from "@/features/error/error-handler";
import { logger } from "@/features/logging/logger";
import { ErrorCodes } from "@/features/error/types";
import { AppError, toAppError } from "@/types/extended-error";
import type { CreateAppointmentDTO, UpdateAppointmentDTO } from "@/types/appointment";
import type { PostgrestError } from "@supabase/supabase-js";

export const useAppointmentMutations = (userId?: string) => {
  const queryClient = useQueryClient();
  const MODULE = 'appointments';

  const formatErrorContext = (error: PostgrestError) => {
    return toAppError(`Database error: ${error.message}`, {
      code: error.code,
      details: error.details,
      hint: error.hint,
      message: error.message
    });
  };

  const createAppointment = useMutation({
    mutationFn: async (data: CreateAppointmentDTO) => {
      logger.info(MODULE, 'Creating appointment', { userId, ...data });
      
      const { error } = await supabase
        .from('appointments')
        .insert({
          ...data,
          status: 'pending'
        });

      if (error) {
        logger.error(MODULE, 'Failed to create appointment', formatErrorContext(error));
        throw formatErrorContext(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', userId] });
      logger.info(MODULE, 'Appointment created successfully', { userId });
    },
    onError: (error: Error) => {
      handleError(error, ErrorCodes.APPOINTMENTS.CREATE_FAILED);
    }
  });

  const updateAppointment = useMutation({
    mutationFn: async (data: UpdateAppointmentDTO) => {
      logger.info(MODULE, 'Updating appointment', { 
        appointmentId: data.id,
        userId 
      });

      const { error } = await supabase
        .from('appointments')
        .update(data)
        .eq('id', data.id);

      if (error) {
        logger.error(MODULE, 'Failed to update appointment', formatErrorContext(error));
        throw formatErrorContext(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', userId] });
      logger.info(MODULE, 'Appointment updated successfully', { userId });
    },
    onError: (error: Error) => {
      handleError(error, ErrorCodes.APPOINTMENTS.UPDATE_FAILED);
    }
  });

  const cancelAppointment = useMutation({
    mutationFn: async (id: string) => {
      logger.info(MODULE, 'Canceling appointment', { 
        appointmentId: id,
        userId 
      });

      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) {
        logger.error(MODULE, 'Failed to cancel appointment', formatErrorContext(error));
        throw formatErrorContext(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', userId] });
      logger.info(MODULE, 'Appointment cancelled successfully', { userId });
    },
    onError: (error: Error) => {
      handleError(error, ErrorCodes.APPOINTMENTS.UPDATE_FAILED);
    }
  });

  return {
    createAppointment,
    updateAppointment,
    cancelAppointment
  };
};
