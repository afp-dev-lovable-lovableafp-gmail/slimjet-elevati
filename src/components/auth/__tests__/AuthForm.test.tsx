
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import AuthForm from '../AuthForm';

describe('AuthForm Rendering', () => {
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
});
