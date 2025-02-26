
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import AdminDashboard from '@/components/sections/admin/AdminDashboard';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Painel Administrativo', () => {
  const mockProfile = {
    id: '1',
    full_name: 'Admin Test',
    is_admin: true,
  };

  beforeEach(() => {
    (useAuth as any).mockReturnValue({
      profile: mockProfile,
      signOut: vi.fn(),
    });
  });

  it('deve renderizar o dashboard com as opções principais', () => {
    renderWithProviders(<AdminDashboard />);

    // Verifica elementos principais
    expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.full_name)).toBeInTheDocument();

    // Verifica cards de menu
    expect(screen.getByText('Agendamentos')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Serviços')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('deve permitir navegação entre as seções', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminDashboard />);

    // Clica em diferentes cards e verifica navegação
    const agendamentosCard = screen.getByText('Agendamentos').closest('a');
    expect(agendamentosCard).toHaveAttribute('href', '/manager-admin/agendamentos');

    const servicosCard = screen.getByText('Serviços').closest('a');
    expect(servicosCard).toHaveAttribute('href', '/manager-admin/servicos');
  });

  it('deve realizar logout corretamente', async () => {
    const mockSignOut = vi.fn();
    (useAuth as any).mockReturnValue({
      profile: mockProfile,
      signOut: mockSignOut,
    });

    const user = userEvent.setup();
    renderWithProviders(<AdminDashboard />);

    // Clica no botão de logout
    const logoutButton = screen.getByRole('button', { name: /sair/i });
    await user.click(logoutButton);

    // Verifica se a função foi chamada
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('deve redirecionar usuário não autenticado', () => {
    (useAuth as any).mockReturnValue({
      profile: null,
      signOut: vi.fn(),
    });

    renderWithProviders(<AdminDashboard />);
    expect(window.location.pathname).toBe('/admin-auth');
  });

  it('deve redirecionar usuário não admin', () => {
    (useAuth as any).mockReturnValue({
      profile: { ...mockProfile, is_admin: false },
      signOut: vi.fn(),
    });

    renderWithProviders(<AdminDashboard />);
    expect(window.location.pathname).toBe('/');
  });
});
