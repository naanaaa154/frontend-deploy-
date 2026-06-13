export interface DashboardStats {
  totalNotes: number;
  todayNotes: number;
  totalRecordings: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'note' | 'recording' | 'ai-summary';
  title: string;
  timestamp: Date;
  description?: string;
}

export type ActivityType = 'note' | 'recording' | 'ai-summary';

export interface DashboardFilters {
  activityType?: ActivityType;
  dateRange?: {
    start: Date;
    end: Date;
  };
  limit?: number;
}

export interface DashboardConfig {
  autoRefreshInterval: number; // in milliseconds
  maxRecentItems: number;
  showNotifications: boolean;
}