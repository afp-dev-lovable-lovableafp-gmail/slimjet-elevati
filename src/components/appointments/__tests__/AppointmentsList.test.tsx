
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import AppointmentsList from '../AppointmentsList';
import { useQuery } from '@tanstack/react-query';

// Mock do react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('AppointmentsList', () => {
  const mockAppointments = [
    {
      id: '1',
      services: { name: 'Serviço Test 1', price: 100 },
      scheduled_at: new Date().toISOString(),
      status: 'pending',
      notes: 'Observação teste',
    },
    {
      id: '2',
      services: { name: 'Serviço Test 2', price: 200 },
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
    renderWithProviders(<AppointmentsList />);

    expect(screen.getByText('Serviço Test 1')).toBeInTheDocument();
    expect(screen.getByText('Serviço Test 2')).toBeInTheDocument();
  });

  it('deve mostrar estado de loading', () => {
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: true,
    });

    renderWithProviders(<AppointmentsList />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve mostrar mensagem quando não há agendamentos', () => {
    (useQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
    });

    renderWithProviders(<AppointmentsList />);
    expect(screen.getByText(/você ainda não tem agendamentos/i)).toBeInTheDocument();
  });

  it('deve permitir cancelar um agendamento pendente', async () => {
    renderWithProviders(<AppointmentsList />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText(/agendamento cancelado com sucesso/i)).toBeInTheDocument();
    });
  });
});
