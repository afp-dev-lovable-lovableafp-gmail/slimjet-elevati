
import { useState } from "react";
import type { Appointment } from "@/types/appointment";

/**
 * Hook para gerenciar o estado local de agendamentos.
 * Controla estados de modal, formulários e seleção de agendamentos.
 * 
 * @example
 * ```tsx
 * const {
 *   selectedAppointment,
 *   isFormOpen,
 *   openForm,
 *   closeForm
 * } = useAppointmentState();
 * 
 * return (
 *   <>
 *     <button onClick={() => openForm()}>Novo Agendamento</button>
 *     {isFormOpen && <AppointmentForm onClose={closeForm} />}
 *   </>
 * );
 * ```
 * 
 * @returns {Object} Estado e funções para controle de agendamentos
 */
export const useAppointmentState = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  /**
   * Abre o formulário de agendamento, opcionalmente com um agendamento selecionado
   * @param {Appointment} [appointment] - Agendamento para edição (opcional)
   */
  const openForm = (appointment?: Appointment) => {
    if (appointment) {
      setSelectedAppointment(appointment);
    }
    setIsFormOpen(true);
  };

  /**
   * Fecha o formulário e limpa o agendamento selecionado
   */
  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedAppointment(null);
  };

  /**
   * Abre o diálogo de cancelamento para um agendamento específico
   * @param {Appointment} appointment - Agendamento a ser cancelado
   */
  const openCancelDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelDialogOpen(true);
  };

  /**
   * Fecha o diálogo de cancelamento e limpa o agendamento selecionado
   */
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
