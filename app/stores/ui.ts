import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  isOnline: boolean;
}

interface UIActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setOnlineStatus: (online: boolean) => void;
}

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({
      // State
      theme: 'system',
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      isOnline: true,

      // Actions
      setTheme: (theme) => set({ theme }),
      
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        set({ theme: newTheme });
      },

      toggleSidebar: () => {
        set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      
      setOnlineStatus: (online) => set({ isOnline: online })
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed
      })
    }
  )
);

// Convenience hooks
export const useTheme = () => useUIStore(state => state.theme);
export const useSidebarCollapsed = () => useUIStore(state => state.sidebarCollapsed);
export const useMobileMenuOpen = () => useUIStore(state => state.mobileMenuOpen);
export const useIsOnline = () => useUIStore(state => state.isOnline);