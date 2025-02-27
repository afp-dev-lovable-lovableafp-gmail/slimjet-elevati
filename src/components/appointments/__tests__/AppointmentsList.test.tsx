
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import AppointmentsList from '../AppointmentsList';
import { useQuery } from '@tanstack/react-query';
import type { Appointment } from '@/types/appointment';

// Mock do react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('AppointmentsList', () => {
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      user_id: 'user-1',
      service_id: 'service-1',
      services: { 
        id: 'service-1',
        name: 'Serviço Test 1', 
        price: 100,
        duration: 60
      },
      scheduled_at: new Date().toISOString(),
      status: 'pending',
      notes: 'Observação teste',
    },
    {
      id: '2',
      user_id: 'user-2',
      service_id: 'service-2',
      services: { 
        id: 'service-2',
        name: 'Serviço Test 2', 
        price: 200,
        duration: 90
      },
      scheduled_at: new Date().toISOString(),
      status: 'completed',
      notes: null,
    },
  ];

  beforeEach(() => {
    (useQuery as any).mockReturnValue({
      data: mockAppointments,
      isLoading: false,
    });
  });

  it('deve renderizar a lista de agendamentos', () => {
    renderWithProviders(<AppointmentsList appointments={mockAppointments} />);

    expect(screen.getByText('Serviço Test 1')).toBeInTheDocument();
    expect(screen.getByText('Serviço Test 2')).toBeInTheDocument();
  });

  it('deve mostrar estado de loading', () => {
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: true,
    });

    renderWithProviders(<AppointmentsList appointments={[]} isLoading={true} />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('deve mostrar mensagem quando não há agendamentos', () => {
    (useQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
    });

    renderWithProviders(<AppointmentsList appointments={[]} />);
    expect(screen.getByText(/você ainda não tem agendamentos/i)).toBeInTheDocument();
  });

  it('deve permitir cancelar um agendamento pendente', async () => {
    renderWithProviders(<AppointmentsList appointments={mockAppointments} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText(/agendamento cancelado com sucesso/i)).toBeInTheDocument();
    });
  });
});
