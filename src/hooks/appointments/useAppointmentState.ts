
import { useState } from "react";
import type { Appointment } from "@/types/appointment";

export const useAppointmentState = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const openForm = (appointment?: Appointment) => {
    if (appointment) {
      setSelectedAppointment(appointment);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedAppointment(null);
  };

  const openCancelDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setIsCancelDialogOpen(false);
    setSelectedAppointment(null);
  };

  return {
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
  };
};
