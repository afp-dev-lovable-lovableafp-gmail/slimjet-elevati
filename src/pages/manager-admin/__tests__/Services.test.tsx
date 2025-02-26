
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { supabase } from '@/lib/supabase';
import Services from '../Services';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn(),
    })),
  },
}));

describe('Gerenciamento de Serviços', () => {
  const mockServices = [
    {
      id: '1',
      name: 'Consultoria',
      description: 'Consultoria em TI',
      price: 100,
      duration: 60,
      is_active: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.from as any)().order.mockResolvedValue({
      data: mockServices,
      error: null,
    });
  });

  it('deve listar serviços existentes', async () => {
    renderWithProviders(<Services />);

    await waitFor(() => {
      expect(screen.getByText('Consultoria')).toBeInTheDocument();
      expect(screen.getByText('Consultoria em TI')).toBeInTheDocument();
    });
  });

  it('deve criar um novo serviço', async () => {
    const user = userEvent.setup();
    
    (supabase.from as any)().insert.mockResolvedValue({
      data: { id: 'new-service' },
      error: null,
    });

    renderWithProviders(<Services />);

    // Clica no botão de novo serviço
    const newButton = screen.getByText(/novo serviço/i);
    await user.click(newButton);

    // Preenche o formulário
    await user.type(screen.getByLabelText(/nome/i), 'Novo Serviço');
    await user.type(screen.getByLabelText(/descrição/i), 'Descrição do novo serviço');
    await user.type(screen.getByLabelText(/preço/i), '150');
    await user.type(screen.getByLabelText(/duração/i), '90');

    // Salva o serviço
    const saveButton = screen.getByRole('button', { name: /salvar/i });
    await user.click(saveButton);

    // Verifica se o serviço foi criado
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('services');
      expect(screen.getByText(/serviço criado com sucesso/i)).toBeInTheDocument();
    });
  });

  it('deve editar um serviço existente', async () => {
    const user = userEvent.setup();

    (supabase.from as any)().update.mockResolvedValue({
      data: { id: '1' },
      error: null,
    });

    renderWithProviders(<Services />);

    // Aguarda carregar os serviços
    await waitFor(() => {
      expect(screen.getByText('Consultoria')).toBeInTheDocument();
    });

    // Clica no botão de editar
    const editButton = screen.getByLabelText(/editar serviço/i);
    await user.click(editButton);

    // Modifica o nome
    const nameInput = screen.getByDisplayValue('Consultoria');
    await user.clear(nameInput);
    await user.type(nameInput, 'Consultoria Atualizada');

    // Salva as alterações
    const saveButton = screen.getByRole('button', { name: /salvar/i });
    await user.click(saveButton);

    // Verifica se foi atualizado
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('services');
      expect(screen.getByText(/serviço atualizado com sucesso/i)).toBeInTheDocument();
    });
  });

  it('deve excluir um serviço', async () => {
    const user = userEvent.setup();

    (supabase.from as any)().delete.mockResolvedValue({
      error: null,
    });

    renderWithProviders(<Services />);

    // Aguarda carregar os serviços
    await waitFor(() => {
      expect(screen.getByText('Consultoria')).toBeInTheDocument();
    });

    // Clica no botão de excluir
    const deleteButton = screen.getByLabelText(/excluir serviço/i);
    await user.click(deleteButton);

    // Confirma a exclusão
    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    await user.click(confirmButton);

    // Verifica se foi excluído
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('services');
      expect(screen.getByText(/serviço excluído com sucesso/i)).toBeInTheDocument();
    });
  });
});
