
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import ProfileForm from '../ProfileForm';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

// Mock dos hooks
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock do Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      update: vi.fn(),
    })),
  },
}));

describe('ProfileForm', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
  };

  const mockProfile = {
    full_name: 'John Doe',
    company_name: 'Test Company',
    phone: '(11)99999-9999',
    avatar_url: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: mockUser });
    (supabase.from as any)().single.mockResolvedValue({
      data: mockProfile,
      error: null,
    });
  });

  it('deve renderizar o formulário com os dados do perfil', async () => {
    renderWithProviders(<ProfileForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument();
      expect(screen.getByDisplayValue('(11)99999-9999')).toBeInTheDocument();
    });
  });

  it('deve permitir atualização dos dados do perfil', async () => {
    renderWithProviders(<ProfileForm />);

    const fullNameInput = await screen.findByDisplayValue('John Doe');
    await userEvent.clear(fullNameInput);
    await userEvent.type(fullNameInput, 'Jane Doe');

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await userEvent.click(submitButton);

    expect(supabase.from).toHaveBeenCalledWith('clients');
  });

  it('deve mostrar erro quando a atualização falha', async () => {
    (supabase.from as any)().update.mockResolvedValue({
      error: new Error('Erro ao atualizar perfil'),
    });

    renderWithProviders(<ProfileForm />);

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/erro ao atualizar perfil/i)).toBeInTheDocument();
    });
  });
});
