import { useAuthStore } from '../stores/auth-store';

// Selector hooks untuk specific data
export const useUser = () => useAuthStore(state => state.user);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthHydrated = () => useAuthStore(state => state.hasHydrated);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);

// Action hooks
export const useAuthActions = () => {
  const login = useAuthStore(state => state.login);
  const register = useAuthStore(state => state.register);
  const logout = useAuthStore(state => state.logout);
  const setUser = useAuthStore(state => state.setUser);
  
  return { login, register, logout, setUser };
};