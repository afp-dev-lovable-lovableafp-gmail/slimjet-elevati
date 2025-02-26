
import { renderHook, waitFor } from '@testing-library/react';
import { useAnalytics } from '../useAnalytics';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { supabase } from '@/lib/supabase';
import type { ReactNode } from 'react';
import React from 'react';
import type { PostgrestResponse, PostgrestError } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Define the shape of our mock data
interface MockData {
  pageVisits: Array<{ id: string; page_path: string; count: number; visit_date: string; visit_hour: number }>;
  popularServices: Array<{ service_id: string; name: string; count: number; services: { name: string } }>;
  feedbacks: Array<{ id: string; rating: number; created_at: string }>;
  npsData: Array<{ id: string; score: number; created_at: string }>;
}

// Mock data
const mockData: MockData = {
  pageVisits: [
    { id: '1', page_path: '/home', count: 10, visit_date: '2024-01-01', visit_hour: 12 }
  ],
  popularServices: [
    { service_id: '1', name: 'Service 1', count: 5, services: { name: 'Service 1' } }
  ],
  feedbacks: [
    { id: '1', rating: 5, created_at: '2024-01-01' }
  ],
  npsData: [
    { id: '1', score: 9, created_at: '2024-01-01' }
  ]
};

// Supabase response factory with proper typing
function createSupabaseResponse<T>(data: T[] | null = null, error: PostgrestError | null = null): PostgrestResponse<T[]> {
  return {
    data: Array.isArray(data) ? [data] : null,
    error,
    count: null,
    status: error ? 500 : 200,
    statusText: error ? 'Error' : 'OK'
  } as PostgrestResponse<T[]>;
}

// Query builder mock factory
const createQueryBuilderMock = (responseData: any = null, error: PostgrestError | null = null) => {
  const response = createSupabaseResponse(Array.isArray(responseData) ? responseData : [responseData], error);
  const mock = {
    select: () => mock,
    gte: () => mock,
    lte: () => mock,
    order: () => mock,
    limit: () => Promise.resolve(response),
    eq: () => mock,
    neq: () => mock,
    gt: () => mock,
    lt: () => mock,
    like: () => mock,
    ilike: () => mock,
    is: () => mock,
    in: () => mock,
    contains: () => mock,
    match: () => mock,
    not: () => mock,
    or: () => mock,
    filter: () => mock,
    single: () => mock,
    maybeSingle: () => mock,
    range: () => mock,
    textSearch: () => mock,
    throwOnError: () => mock,
    abortSignal: () => mock,
    count: () => mock,
    headers: {},
    url: new URL('http://localhost'),
    insert: () => mock,
    upsert: () => mock,
    update: () => mock,
    delete: () => mock
  };
  return mock as any;
};

describe('useAnalytics', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
    vi.resetAllMocks();
  });

  const createWrapper = () => {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };
  };

  it('should fetch analytics data successfully', async () => {
    const fromSpy = vi.spyOn(supabase, 'from');
    fromSpy.mockImplementation((table: string) => {
      const data = mockData[table as keyof MockData] || [];
      return createQueryBuilderMock(data);
    });

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pageVisits).toEqual(mockData.pageVisits);
    expect(result.current.popularServices).toEqual(mockData.popularServices);
    expect(result.current.feedbacks).toEqual(mockData.feedbacks);
    expect(result.current.npsData).toEqual(mockData.npsData);
  });

  it('should handle errors gracefully', async () => {
    const mockError: PostgrestError = {
      message: 'Failed to fetch',
      details: 'Database error',
      hint: 'Check your connection',
      code: 'ERROR',
      name: 'PostgrestError'
    };

    const fromSpy = vi.spyOn(supabase, 'from');
    fromSpy.mockImplementation(() => createQueryBuilderMock(null, mockError));

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
