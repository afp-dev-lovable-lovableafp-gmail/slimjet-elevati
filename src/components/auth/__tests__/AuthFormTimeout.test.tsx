
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

describe('AuthForm Timeout and Connection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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
