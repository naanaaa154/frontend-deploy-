import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DashboardStats, ActivityItem } from '../types';

interface DashboardState {
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface DashboardActions {
  // Actions
  loadStats: () => Promise<void>;
  refreshStats: () => Promise<void>;
  clearError: () => void;
  
  // Selectors
  getStats: () => DashboardStats;
  getRecentActivity: () => ActivityItem[];
  isStatsLoading: () => boolean;
}

type DashboardStore = DashboardState & DashboardActions;

const initialState: DashboardState = {
  stats: {
    totalNotes: 0,
    todayNotes: 0,
    totalRecordings: 0,
    recentActivity: [],
  },
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Actions
      loadStats: async () => {
        set({ isLoading: true, error: null });
        try {
          // Mock data - replace with actual API call
          const mockStats: DashboardStats = {
            totalNotes: 42,
            todayNotes: 5,
            totalRecordings: 18,
            recentActivity: [
              {
                id: '1',
                type: 'note',
                title: 'Meeting Notes - Project Planning',
                timestamp: new Date(),
                description: 'Team meeting about Q4 planning',
              },
              {
                id: '2',
                type: 'recording',
                title: 'Voice Memo - Ideas',
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
                description: 'Quick voice note about new features',
              },
              {
                id: '3',
                type: 'ai-summary',
                title: 'AI Summary Generated',
                timestamp: new Date(Date.now() - 1000 * 60 * 60),
                description: 'Summary for yesterday\'s meeting',
              },
            ],
          };

          await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

          set({
            stats: mockStats,
            isLoading: false,
            lastUpdated: new Date(),
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load dashboard stats',
            isLoading: false,
          });
        }
      },

      refreshStats: async () => {
        const { loadStats } = get();
        await loadStats();
      },

      clearError: () => {
        set({ error: null });
      },

      // Selectors
      getStats: () => {
        return get().stats;
      },

      getRecentActivity: () => {
        return get().stats.recentActivity;
      },

      isStatsLoading: () => {
        return get().isLoading;
      },
    }),
    {
      name: 'dashboard-store',
    }
  )
);