
import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { useAppointmentQueries } from "./appointments/useAppointmentQueries";
import { useAppointmentActions } from "./appointments/useAppointmentActions";
import { useAppointmentState } from "./appointments/useAppointmentState";
import { toast } from "sonner";
import type { CreateAppointmentDTO, Appointment, AppointmentStatus } from "@/types/appointment";

export const useAppointments = () => {
  const { user } = useAuth();
  const { 
    data: appointments, 
    isLoading, 
    error,
    refetch 
  } = useAppointmentQueries(user?.id);

  const {
    createAppointment,
    updateAppointment,
    cancelAppointment
  } = useAppointmentActions(user?.id);

  const {
    selectedAppointment,
    setSelectedAppointment,
    isFormOpen,
    setIsFormOpen,
    isCancelDialogOpen,
    setIsCancelDialogOpen,
    openForm,
    closeForm,
    openCancelDialog,
    closeCancelDialog,
  } = useAppointmentState();

  const handleCreate = useCallback(async (data: CreateAppointmentDTO) => {
    try {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      await createAppointment.mutateAsync({
        ...data,
        user_id: user.id
      });

      closeForm();
      await refetch();

      return true;
    } catch (error: any) {
      console.error("[Appointments] Erro ao criar:", error);
      toast("Erro ao criar agendamento", {
        description: error.message || "Não foi possível criar o agendamento. Tente novamente."
      });
      return false;
    }
  }, [user?.id, createAppointment, closeForm, refetch]);

  const handleUpdate = useCallback(async (appointmentId: string, data: Partial<Appointment>) => {
    try {
      await updateAppointment.mutateAsync({
        id: appointmentId,
        ...data
      });

      await refetch();
      return true;
    } catch (error: any) {
      console.error("[Appointments] Erro ao atualizar:", error);
      toast("Erro ao atualizar agendamento", {
        description: error.message || "Não foi possível atualizar o agendamento. Tente novamente."
      });
      return false;
    }
  }, [updateAppointment, refetch]);

  const handleCancel = useCallback(async (appointmentId: string) => {
    try {
      await cancelAppointment.mutateAsync(appointmentId);
      closeCancelDialog();
      await refetch();

      return true;
    } catch (error: any) {
      console.error("[Appointments] Erro ao cancelar:", error);
      toast("Erro ao cancelar agendamento", {
        description: error.message || "Não foi possível cancelar o agendamento. Tente novamente."
      });
      return false;
    }
  }, [cancelAppointment, closeCancelDialog, refetch]);

  return {
    // Estado dos agendamentos
    appointments,
    isLoading,
    error,
    
    // Estado do formulário/diálogo
    selectedAppointment,
    setSelectedAppointment,
    isFormOpen,
    setIsFormOpen,
    isCancelDialogOpen,
    setIsCancelDialogOpen,
    
    // Ações
    createAppointment: handleCreate,
    updateAppointment: handleUpdate,
    cancelAppointment: handleCancel,
    
    // Helpers
    openForm,
    closeForm,
    openCancelDialog,
    closeCancelDialog,
  };
};
