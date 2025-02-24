
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import AuthForm from '../AuthForm';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn(),
    })),
  },
}));

describe('AuthForm Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve realizar login com sucesso', async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    renderWithProviders(<AuthForm />);

    await userEvent.type(screen.getByPlaceholderText(/e-mail/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/senha/i), 'password123');

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    await userEvent.click(submitButton);

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('deve mostrar erro quando login falha', async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: null,
      error: new Error('Credenciais inválidas'),
    });

    renderWithProviders(<AuthForm />);

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });
});
