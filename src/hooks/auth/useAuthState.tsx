
import { create } from 'zustand';
import { AuthState } from '@/types/auth';

// Estado inicial
const initialState: AuthState = {
  user: null,
  profile: null,
  client: null,
  loading: true,
  initialized: false,
  authenticated: false,
  error: null
};

// Hook para gerenciar o estado de autenticação
export const useAuthState = create<{
  authState: AuthState;
  setAuthState: (newState: Partial<AuthState> | ((prev: AuthState) => AuthState)) => void;
  setUser: (user: AuthState['user']) => void;
  setLoading: (loading: boolean) => void;
}>((set) => ({
  authState: initialState,
  setAuthState: (newState) => set((state) => {
    if (typeof newState === 'function') {
      return { authState: newState(state.authState) };
    }
    return { 
      authState: { 
        ...state.authState, 
        ...newState,
        authenticated: newState.user ? true : state.authState.user ? true : false
      } 
    };
  }),
  setUser: (user) => set((state) => ({
    authState: {
      ...state.authState,
      user,
      authenticated: !!user
    }
  })),
  setLoading: (loading) => set((state) => ({
    authState: {
      ...state.authState,
      loading
    }
  }))
}));
