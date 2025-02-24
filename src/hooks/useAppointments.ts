
import { useAuth } from "./useAuth";
import { useAppointmentState } from "./appointments/useAppointmentState";
import { useAppointmentActions } from "./appointments/useAppointmentActions";
import { useAppointmentQuery } from "./appointments/useAppointmentQuery";
import { useCallback } from "react";

export const useAppointments = () => {
  const { user } = useAuth();
  const { data: appointments, isLoading, error } = useAppointmentQuery(user?.id);
  const { createAppointment, updateAppointment, cancelAppointment } = useAppointmentActions(user?.id);
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

  const handleCreateAppointment = useCallback(async (data: any) => {
    await createAppointment.mutateAsync(data);
    closeForm();
  }, [createAppointment, closeForm]);

  const handleCancelAppointment = useCallback(async (appointmentId: string) => {
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
    createAppointment: handleCreateAppointment,
    updateAppointment: updateAppointment.mutate,
    cancelAppointment: handleCancelAppointment,
    openForm,
    closeForm,
    openCancelDialog,
    closeCancelDialog,
  };
};
