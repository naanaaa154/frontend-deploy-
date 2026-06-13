import { useEffect } from 'react';
import { useDashboardStore } from '../stores/dashboard-store';
import type { ActivityItem } from '../types';

export const useDashboard = () => {
  const {
    stats,
    isLoading,
    error,
    lastUpdated,
    loadStats,
    refreshStats,
    clearError,
    getStats,
    getRecentActivity,
    isStatsLoading,
  } = useDashboardStore();

  // Auto-load stats on mount
  useEffect(() => {
    if (!lastUpdated) {
      loadStats();
    }
  }, [lastUpdated]); // Remove loadStats from dependencies

  return {
    // State
    stats,
    isLoading,
    error,
    lastUpdated,
    
    // Actions
    loadStats,
    refreshStats,
    clearError,
    
    // Computed/Selectors
    recentActivity: getRecentActivity(),
    isStatsLoading: isStatsLoading(),
    
    // Convenience methods
    hasData: !!lastUpdated,
    needsRefresh: lastUpdated ? Date.now() - lastUpdated.getTime() > 5 * 60 * 1000 : false, // 5 minutes
  };
};

export const useDashboardStats = () => {
  const { stats, isLoading, error } = useDashboard();
  
  return {
    stats,
    isLoading,
    error,
    
    // Computed stats
    totalItems: stats.totalNotes + stats.totalRecordings,
    activityToday: stats.todayNotes,
    hasActivity: stats.recentActivity.length > 0,
  };
};

export const useRecentActivity = () => {
  const { stats, isLoading } = useDashboard();
  
  return {
    activities: stats.recentActivity,
    isLoading,
    hasActivities: stats.recentActivity.length > 0,
    
    // Grouped activities
    activitiesByType: {
      notes: stats.recentActivity.filter(item => item.type === 'note'),
      recordings: stats.recentActivity.filter(item => item.type === 'recording'),
      aiSummaries: stats.recentActivity.filter(item => item.type === 'ai-summary'),
    },
  };
};