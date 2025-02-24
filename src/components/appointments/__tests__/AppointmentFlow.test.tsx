
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { supabase } from '@/lib/supabase';
import AppointmentForm from '../AppointmentForm';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn(),
      insert: vi.fn(),
    })),
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(),
    },
  },
}));

describe('Fluxo de Agendamento', () => {
  const mockUser = { id: '123', email: 'test@example.com' };
  const mockServices = [
    {
      id: '1',
      name: 'Consultoria de TI',
      price: 100,
      duration: 60,
      description: 'Consultoria especializada',
      is_active: true,
    },
    {
      id: '2',
      name: 'Desenvolvimento Web',
      price: 200,
      duration: 120,
      description: 'Desenvolvimento de sites',
      is_active: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as any).mockResolvedValue({ data: { user: mockUser } });
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: mockUser } },
    });
    (supabase.from as any)().order.mockResolvedValue({
      data: mockServices,
      error: null,
    });
  });

  it('deve completar o fluxo de agendamento com sucesso', async () => {
    const user = userEvent.setup();
    
    // Mock do insert do agendamento
    (supabase.from as any)().insert.mockResolvedValue({
      data: { id: 'new-appointment-id' },
      error: null,
    });

    renderWithProviders(<AppointmentForm />);

    // Aguarda o carregamento dos serviços
    await waitFor(() => {
      expect(screen.getByText('Consultoria de TI')).toBeInTheDocument();
    });

    // Seleciona um serviço
    const serviceSelect = screen.getByLabelText(/serviço/i);
    await user.click(serviceSelect);
    await user.click(screen.getByText('Consultoria de TI'));

    // Seleciona uma data
    const dateInput = screen.getByLabelText(/data/i);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    await user.type(dateInput, futureDate.toISOString().split('T')[0]);

    // Seleciona um horário
    const timeInput = screen.getByLabelText(/horário/i);
    await user.type(timeInput, '14:00');

    // Adiciona observações
    const notesInput = screen.getByLabelText(/observações/i);
    await user.type(notesInput, 'Teste de agendamento');

    // Submete o formulário
    const submitButton = screen.getByRole('button', { name: /agendar/i });
    await user.click(submitButton);

    // Verifica se o agendamento foi criado
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('appointments');
      expect(screen.getByText(/agendamento realizado com sucesso/i)).toBeInTheDocument();
    });
  });

  it('deve mostrar erro quando falhar ao criar agendamento', async () => {
    const user = userEvent.setup();
    
    // Mock do erro no insert
    (supabase.from as any)().insert.mockResolvedValue({
      data: null,
      error: new Error('Erro ao criar agendamento'),
    });

    renderWithProviders(<AppointmentForm />);

    // Preenche o formulário
    await waitFor(() => {
      expect(screen.getByText('Consultoria de TI')).toBeInTheDocument();
    });

    const serviceSelect = screen.getByLabelText(/serviço/i);
    await user.click(serviceSelect);
    await user.click(screen.getByText('Consultoria de TI'));

    const dateInput = screen.getByLabelText(/data/i);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    await user.type(dateInput, futureDate.toISOString().split('T')[0]);

    const timeInput = screen.getByLabelText(/horário/i);
    await user.type(timeInput, '14:00');

    // Submete o formulário
    const submitButton = screen.getByRole('button', { name: /agendar/i });
    await user.click(submitButton);

    // Verifica se a mensagem de erro é exibida
    await waitFor(() => {
      expect(screen.getByText(/erro ao criar agendamento/i)).toBeInTheDocument();
    });
  });

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(<AppointmentForm />);

    // Tenta submeter sem preencher os campos
    const submitButton = screen.getByRole('button', { name: /agendar/i });
    await user.click(submitButton);

    // Verifica mensagens de validação
    await waitFor(() => {
      expect(screen.getByText(/selecione um serviço/i)).toBeInTheDocument();
      expect(screen.getByText(/selecione uma data/i)).toBeInTheDocument();
      expect(screen.getByText(/selecione um horário/i)).toBeInTheDocument();
    });
  });

  it('deve prevenir agendamento em data passada', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(<AppointmentForm />);

    await waitFor(() => {
      expect(screen.getByText('Consultoria de TI')).toBeInTheDocument();
    });

    // Seleciona serviço
    const serviceSelect = screen.getByLabelText(/serviço/i);
    await user.click(serviceSelect);
    await user.click(screen.getByText('Consultoria de TI'));

    // Tenta selecionar data passada
    const dateInput = screen.getByLabelText(/data/i);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    await user.type(dateInput, pastDate.toISOString().split('T')[0]);

    // Verifica mensagem de erro
    await waitFor(() => {
      expect(screen.getByText(/data não pode ser no passado/i)).toBeInTheDocument();
    });
  });

  it('deve lidar com erro de rede ao carregar serviços', async () => {
    // Mock do erro de rede
    (supabase.from as any)().order.mockRejectedValue(new Error('Network Error'));

    renderWithProviders(<AppointmentForm />);

    await waitFor(() => {
      expect(screen.getByText(/erro ao carregar serviços/i)).toBeInTheDocument();
    });
  });
});
