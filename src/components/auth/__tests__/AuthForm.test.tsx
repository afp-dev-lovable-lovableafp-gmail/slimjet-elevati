
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

const mockTimeoutPromise = () => new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Timeout')), 5000);
});

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve renderizar o formulário de login corretamente', () => {
    renderWithProviders(<AuthForm />);
    
    expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
  });

  it('deve alternar entre login e registro', async () => {
    renderWithProviders(<AuthForm />);

    const toggleButton = screen.getByText(/criar conta/i);
    await userEvent.click(toggleButton);

    expect(screen.getByPlaceholderText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/telefone/i)).toBeInTheDocument();
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

  describe('Validações de formato', () => {
    it('deve validar formato de email inválido', async () => {
      renderWithProviders(<AuthForm />);
      
      await userEvent.type(screen.getByPlaceholderText(/e-mail/i), 'invalidemail');
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await userEvent.click(submitButton);
      
      expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument();
    });

    it('deve validar formato de telefone no registro', async () => {
      renderWithProviders(<AuthForm />);
      
      await userEvent.click(screen.getByText(/não tem uma conta/i));
      
      await userEvent.type(screen.getByPlaceholderText(/telefone/i), '123456');
      const submitButton = screen.getByRole('button', { name: /criar conta/i });
      await userEvent.click(submitButton);
      
      expect(screen.getByText(/telefone deve estar no formato/i)).toBeInTheDocument();
    });
  });

  describe('Timeout e conexão', () => {
    it('deve lidar com timeout na requisição', async () => {
      (supabase.auth.signInWithPassword as any).mockImplementation(mockTimeoutPromise);
      
      renderWithProviders(<AuthForm />);
      
      await userEvent.type(screen.getByPlaceholderText(/e-mail/i), 'test@example.com');
      await userEvent.type(screen.getByPlaceholderText(/senha/i), 'password123');
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/tempo de requisição excedido/i)).toBeInTheDocument();
      });
    });

    it('deve lidar com erro de conexão', async () => {
      (supabase.auth.signInWithPassword as any).mockRejectedValue(new Error('Network Error'));
      
      renderWithProviders(<AuthForm />);
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/erro de conexão/i)).toBeInTheDocument();
      });
    });
  });

  describe('Fluxo de registro', () => {
    const mockRegisterData = {
      email: 'new@example.com',
      password: 'Password123!',
      fullName: 'John Doe',
      phone: '(11)99999-9999'
    };

    it('deve completar registro com sucesso', async () => {
      (supabase.auth.signUp as any).mockResolvedValue({
        data: { user: { id: '123' } },
        error: null
      });
      (supabase.from as any)().insert.mockResolvedValue({ error: null });

      renderWithProviders(<AuthForm />);
      
      await userEvent.click(screen.getByText(/não tem uma conta/i));
      
      await userEvent.type(screen.getByPlaceholderText(/e-mail/i), mockRegisterData.email);
      await userEvent.type(screen.getByPlaceholderText(/senha/i), mockRegisterData.password);
      await userEvent.type(screen.getByPlaceholderText(/nome completo/i), mockRegisterData.fullName);
      await userEvent.type(screen.getByPlaceholderText(/telefone/i), mockRegisterData.phone);
      
      const submitButton = screen.getByRole('button', { name: /criar conta/i });
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
          email: mockRegisterData.email,
          password: mockRegisterData.password,
          options: {
            data: {
              full_name: mockRegisterData.fullName,
              phone: mockRegisterData.phone
            }
          }
        });
      });
    });

    it('deve impedir registro com email já existente', async () => {
      (supabase.auth.signUp as any).mockResolvedValue({
        data: null,
        error: new Error('Email already registered')
      });

      renderWithProviders(<AuthForm />);
      
      await userEvent.click(screen.getByText(/não tem uma conta/i));
      
      await userEvent.type(screen.getByPlaceholderText(/e-mail/i), mockRegisterData.email);
      await userEvent.type(screen.getByPlaceholderText(/senha/i), mockRegisterData.password);
      
      const submitButton = screen.getByRole('button', { name: /criar conta/i });
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/e-mail já cadastrado/i)).toBeInTheDocument();
      });
    });
  });
});
