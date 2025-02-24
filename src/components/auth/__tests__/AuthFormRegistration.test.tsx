
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

describe('AuthForm Registration', () => {
  const mockRegisterData = {
    email: 'new@example.com',
    password: 'Password123!',
    fullName: 'John Doe',
    phone: '(11)99999-9999'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

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
