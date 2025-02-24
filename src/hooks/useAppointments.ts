
import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { useAppointmentQueries } from "./appointments/useAppointmentQueries";
import { useAppointmentMutations } from "./appointments/useAppointmentMutations";
import { useAppointmentState } from "./appointments/useAppointmentState";
import type { CreateAppointmentDTO } from "@/types/appointment";

export const useAppointments = () => {
  const { user } = useAuth();
  const { data: appointments, isLoading, error } = useAppointmentQueries(user?.id);
  const { createAppointment, updateAppointment, cancelAppointment } = useAppointmentMutations(user?.id);
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
    await createAppointment.mutateAsync(data);
    closeForm();
  }, [createAppointment, closeForm]);

  const handleCancel = useCallback(async (appointmentId: string) => {
    await cancelAppointment.mutateAsync(appointmentId);
    closeCancelDialog();
  }, [cancelAppointment, closeCancelDialog]);

  return {
    appointments,
    isLoading,
    error,
    selectedAppointment,
    setSelectedAppointment,
    isFormOpen,
    setIsFormOpen,
    isCancelDialogOpen,
    setIsCancelDialogOpen,
    createAppointment: handleCreate,
    updateAppointment: updateAppointment.mutate,
    cancelAppointment: handleCancel,
    openForm,
    closeForm,
    openCancelDialog,
    closeCancelDialog,
  };
};
