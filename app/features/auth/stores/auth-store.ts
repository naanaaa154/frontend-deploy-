import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '../types';
import { authApi } from '../api/auth-api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setHasHydrated: (value: boolean) => void;
  syncAuthFromStorage: () => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        // State
        user: null,
        token: null,
        isAuthenticated: false,
  hasHydrated: false,
        isLoading: false,
        error: null,

        // Actions
        login: async (email, password) => {
          set({ isLoading: true, error: null });
          try {
            const { access_token } = await authApi.login({ email, password });
            const user = await authApi.getMe(access_token);
            
            set({
              user,
              token: access_token,
              isAuthenticated: true,
              isLoading: false
            });
          } catch (error: any) {
            set({ isLoading: false, error: error.message || 'Login failed' });
            throw error;
          }
        },

        register: async (data) => {
           set({ isLoading: true, error: null });
           try {
             await authApi.register(data);
             set({ isLoading: false });
           } catch (error: any) {
             set({ isLoading: false, error: error.message || 'Registration failed' });
             throw error;
           }
        },

        logout: () => {
          set({ user: null, token: null, isAuthenticated: false });
        },

        setUser: (user: User) => {
          set({ user, isAuthenticated: true });
        },

        setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
        syncAuthFromStorage: () =>
          set((state) => ({
            isAuthenticated: Boolean(state.token && state.user),
          })),

        setLoading: (loading: boolean) => set({ isLoading: loading }),
        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          user: state.user, 
          token: state.token, 
          isAuthenticated: state.isAuthenticated 
        }),
        onRehydrateStorage: () => (state) => {
          state?.syncAuthFromStorage();
          state?.setHasHydrated(true);
        },
      }
    )
  )
);