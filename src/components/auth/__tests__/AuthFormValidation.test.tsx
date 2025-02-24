
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import AuthForm from '../AuthForm';

describe('AuthForm Validation', () => {
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
