
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAppointmentActions } from '../useAppointmentActions';
import { supabase } from '@/lib/supabase';

// Mock do Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(),
      update: vi.fn(),
      eq: vi.fn(),
    })),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('useAppointmentActions', () => {
  const userId = '123';

  it('deve criar um agendamento com sucesso', async () => {
    const { result } = renderHook(() => useAppointmentActions(userId));

    const appointmentData = {
      service_id: '456',
      user_id: userId,
      scheduled_at: new Date().toISOString(),
    };

    // Mock da resposta do Supabase
    (supabase.from as any).mockImplementation(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn(),
      eq: vi.fn(),
    }));

    await result.current.createAppointment.mutateAsync(appointmentData);

    expect(supabase.from).toHaveBeenCalledWith('appointments');
  });

  it('deve atualizar um agendamento com sucesso', async () => {
    const { result } = renderHook(() => useAppointmentActions(userId));

    const updateData = {
      id: '789',
      notes: 'Atualização de teste',
    };

    // Mock da resposta do Supabase
    (supabase.from as any).mockImplementation(() => ({
      insert: vi.fn(),
      update: vi.fn().mockResolvedValue({ error: null }),
      eq: vi.fn().mockReturnThis(),
    }));

    await result.current.updateAppointment.mutateAsync(updateData);

    expect(supabase.from).toHaveBeenCalledWith('appointments');
  });
});
