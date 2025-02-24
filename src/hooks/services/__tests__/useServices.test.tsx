
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useServices } from '../../useServices';
import { supabase } from '@/lib/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn(),
    })),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useServices', () => {
  const mockServices = [
    {
      id: '1',
      name: 'Serviço 1',
      price: 100,
      description: 'Descrição 1',
      is_active: true,
      service_tags: [],
    },
    {
      id: '2',
      name: 'Serviço 2',
      price: 200,
      description: 'Descrição 2',
      is_active: true,
      service_tags: [],
    },
  ];

  it('deve retornar serviços ativos corretamente', async () => {
    (supabase.from as any)().order.mockResolvedValue({
      data: mockServices,
      error: null,
    });

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockServices);
    });
  });

  it('deve lidar com erro na requisição', async () => {
    const errorMessage = 'Erro ao buscar serviços';
    (supabase.from as any)().order.mockResolvedValue({
      data: null,
      error: new Error(errorMessage),
    });

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });
});
