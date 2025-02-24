
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import AppointmentForm from '../AppointmentForm';
import { useAuth } from '@/hooks/useAuth';
import { useServices } from '@/hooks/useServices';

// Mock dos hooks
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/hooks/useServices', () => ({
  useServices: vi.fn(),
}));

describe('AppointmentForm', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
  };

  const mockServices = [
    { id: '1', name: 'Serviço 1', price: 100, duration: 60 },
    { id: '2', name: 'Serviço 2', price: 200, duration: 90 },
  ];

  beforeEach(() => {
    // Configure os mocks antes de cada teste
    (useAuth as any).mockReturnValue({ user: mockUser });
    (useServices as any).mockReturnValue({ data: mockServices, isLoading: false });
  });

  it('deve renderizar o formulário corretamente', () => {
    renderWithProviders(<AppointmentForm />);
    
    expect(screen.getByText('Agendar Serviço')).toBeInTheDocument();
    expect(screen.getByText('Serviço')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Horário')).toBeInTheDocument();
  });

  it('deve mostrar os serviços disponíveis', async () => {
    renderWithProviders(<AppointmentForm />);
    
    const serviceSelect = screen.getByRole('combobox', { name: /serviço/i });
    await userEvent.click(serviceSelect);
    
    expect(screen.getByText('Serviço 1')).toBeInTheDocument();
    expect(screen.getByText('Serviço 2')).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios', async () => {
    renderWithProviders(<AppointmentForm />);
    
    const submitButton = screen.getByRole('button', { name: /agendar/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/selecione um serviço/i)).toBeInTheDocument();
    });
  });
});
