
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import AuthForm from '../AuthForm';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      signIn: vi.fn(),
      signUp: vi.fn(),
      loading: false,
    });
  });

  it('deve renderizar o formulário de login por padrão', () => {
    renderWithProviders(<AuthForm />);
    expect(screen.getByText(/entrar/i)).toBeInTheDocument();
  });

  it('deve alternar entre login e registro', async () => {
    renderWithProviders(<AuthForm />);
    
    const toggleButton = screen.getByText(/criar conta/i);
    await userEvent.click(toggleButton);
    
    expect(screen.getByText(/registrar/i)).toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro para email inválido', async () => {
    renderWithProviders(<AuthForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    
    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it('deve mostrar indicador de carregamento durante autenticação', () => {
    (useAuth as any).mockReturnValue({
      signIn: vi.fn(),
      signUp: vi.fn(),
      loading: true,
    });

    renderWithProviders(<AuthForm />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
