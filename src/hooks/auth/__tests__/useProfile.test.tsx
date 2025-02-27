
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
      maybeSingle: vi.fn(),
    })),
    rpc: vi.fn().mockReturnValue({
      data: false,
      error: null
    }),
  },
}));

describe('useProfile', () => {
  const mockUserId = '123';
  const mockProfile = {
    id: mockUserId,
    is_admin: false,
    user_type: 'client'
  };
  
  const mockClient = {
    id: mockUserId,
    full_name: 'John Doe',
    avatar_url: null,
    company_name: 'Test Company',
    phone: '(11)99999-9999',
    email: 'test@example.com'
  };

  it('deve carregar o perfil do usuário corretamente', async () => {
    (supabase.from as any)().maybeSingle.mockResolvedValueOnce({
      data: mockProfile,
      error: null,
    }).mockResolvedValueOnce({
      data: mockClient,
      error: null,
    });

    const { result } = renderHook(() => useProfile(mockUserId));

    expect(result.current.status).toBe('loading');

    await waitFor(() => {
      expect(result.current.status).toBe('success');
      expect(result.current.profile).toEqual(mockProfile);
      expect(result.current.client).toEqual(mockClient);
    });
  });

  it('deve retornar null quando não há userId', async () => {
    const { result } = renderHook(() => useProfile(undefined));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
      expect(result.current.profile).toBeNull();
      expect(result.current.client).toBeNull();
    });
  });

  it('deve lidar com erro ao carregar perfil', async () => {
    const errorMessage = 'Erro ao carregar perfil';
    (supabase.from as any)().maybeSingle.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useProfile(mockUserId));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
      expect(result.current.error).toBeTruthy();
    });
  });

  it('deve permitir recarregar o perfil', async () => {
    (supabase.from as any)().maybeSingle
      .mockResolvedValueOnce({
        data: mockProfile,
        error: null,
      })
      .mockResolvedValueOnce({
        data: mockClient,
        error: null,
      })
      .mockResolvedValueOnce({
        data: { ...mockProfile, is_admin: true },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { ...mockClient, full_name: 'Jane Doe' },
        error: null,
      });

    const { result } = renderHook(() => useProfile(mockUserId));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.profile?.is_admin).toBe(true);
      expect(result.current.client?.full_name).toBe('Jane Doe');
    });
  });
});
