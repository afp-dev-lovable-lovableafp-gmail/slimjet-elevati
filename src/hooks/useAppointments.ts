
import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { useAppointmentQueries } from "./appointments/useAppointmentQueries";
import { useAppointmentActions } from "./appointments/useAppointmentActions";
import { useAppointmentState } from "./appointments/useAppointmentState";
import { toast } from "sonner";
import type { Appointment, AppointmentStatus, CreateAppointmentDTO } from "@/types/appointment";

export const useAppointments = () => {
  const { user } = useAuth();
  const appointmentQueries = useAppointmentQueries();
  const userAppointmentsQuery = appointmentQueries.useUserAppointments();
  
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
      await userAppointmentsQuery.refetch();

      return true;
    } catch (error: any) {
      console.error("[Appointments] Erro ao criar:", error);
      toast("Erro ao criar agendamento", {
        description: error.message || "Não foi possível criar o agendamento. Tente novamente."
      });
      return false;
    }
  }, [user?.id, createAppointment, closeForm, userAppointmentsQuery]);

  const handleUpdate = useCallback(async (appointmentId: string, data: Partial<Appointment>) => {
    try {
      await updateAppointment.mutateAsync({
        id: appointmentId,
        ...data
      });

      await userAppointmentsQuery.refetch();
      return true;
    } catch (error: any) {
      console.error("[Appointments] Erro ao atualizar:", error);
      toast("Erro ao atualizar agendamento", {
        description: error.message || "Não foi possível atualizar o agendamento. Tente novamente."
      });
      return false;
    }
  }, [updateAppointment, userAppointmentsQuery]);

  const handleCancel = useCallback(async (appointmentId: string) => {
    try {
      await cancelAppointment.mutateAsync(appointmentId);
      closeCancelDialog();
      await userAppointmentsQuery.refetch();

      return true;
    } catch (error: any) {
      console.error("[Appointments] Erro ao cancelar:", error);
      toast("Erro ao cancelar agendamento", {
        description: error.message || "Não foi possível cancelar o agendamento. Tente novamente."
      });
      return false;
    }
  }, [cancelAppointment, closeCancelDialog, userAppointmentsQuery]);

  return {
    // Estado dos agendamentos
    appointments: userAppointmentsQuery.data,
    isLoading: userAppointmentsQuery.isLoading,
    error: userAppointmentsQuery.error,
    refetch: userAppointmentsQuery.refetch,
    
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
