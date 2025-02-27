
import { create } from 'zustand';
import { AuthState } from '@/types/auth';

// Estado inicial
const initialState: AuthState = {
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  authenticated: false
};

// Hook para gerenciar o estado de autenticação
export const useAuthState = create<{
  authState: AuthState;
  setAuthState: (newState: Partial<AuthState> | ((prev: AuthState) => AuthState)) => void;
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
}));
