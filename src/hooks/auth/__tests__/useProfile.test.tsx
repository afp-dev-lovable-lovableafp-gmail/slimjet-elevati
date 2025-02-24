
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProfile } from '../useProfile';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

describe('useProfile', () => {
  const mockUserId = '123';
  const mockProfile = {
    id: mockUserId,
    full_name: 'John Doe',
    avatar_url: null,
    company_name: 'Test Company',
    phone: '(11)99999-9999',
  };

  it('deve carregar o perfil do usuário corretamente', async () => {
    (supabase.from as any)().single.mockResolvedValue({
      data: mockProfile,
      error: null,
    });

    const { result } = renderHook(() => useProfile(mockUserId));

    expect(result.current.status).toBe('loading');

    await waitFor(() => {
      expect(result.current.status).toBe('success');
      expect(result.current.profile).toEqual(mockProfile);
    });
  });

  it('deve retornar null quando não há userId', async () => {
    const { result } = renderHook(() => useProfile(undefined));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
      expect(result.current.profile).toBeNull();
    });
  });

  it('deve lidar com erro ao carregar perfil', async () => {
    const errorMessage = 'Erro ao carregar perfil';
    (supabase.from as any)().single.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useProfile(mockUserId));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
      expect(result.current.error).toBeTruthy();
    });
  });

  it('deve permitir recarregar o perfil', async () => {
    (supabase.from as any)().single.mockResolvedValue({
      data: mockProfile,
      error: null,
    });

    const { result } = renderHook(() => useProfile(mockUserId));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    // Simula atualização do perfil
    const updatedProfile = { ...mockProfile, full_name: 'Jane Doe' };
    (supabase.from as any)().single.mockResolvedValue({
      data: updatedProfile,
      error: null,
    });

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.profile?.full_name).toBe('Jane Doe');
    });
  });
});
