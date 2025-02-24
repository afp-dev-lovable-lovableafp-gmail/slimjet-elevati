
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../../useAuth';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signOut: vi.fn(),
    },
  },
}));

describe('useAuth', () => {
  const mockUser = { id: '123', email: 'test@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar o estado inicial corretamente', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: mockUser } },
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.authenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('deve retornar erro quando autenticação falha', async () => {
    (supabase.auth.getSession as any).mockRejectedValue(new Error('Auth error'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.authenticated).toBe(false);
    });
  });

  it('deve atualizar estado ao fazer logout', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: mockUser } },
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.authenticated).toBe(true);
    });

    (supabase.auth.signOut as any).mockResolvedValue({ error: null });

    await result.current.signOut();

    await waitFor(() => {
      expect(result.current.authenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  it('deve lidar com timeout na autenticação', async () => {
    (supabase.auth.getSession as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 5000))
    );

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);

    await waitFor(
      () => {
        expect(result.current.loading).toBe(true);
      },
      { timeout: 1000 }
    );
  });
});
