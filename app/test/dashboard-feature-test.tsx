// Test dashboard feature imports
import { 
  DashboardLayout, 
  DashboardOverview,
  useDashboard,
  useDashboardStats,
  useRecentActivity,
  useDashboardStore,
  type DashboardStats,
  type ActivityItem,
  type ActivityType 
} from '../features/dashboard';

// Test usage
export function TestDashboardImports() {
  const { stats, isLoading } = useDashboard();
  const { totalItems } = useDashboardStats();
  const { activities } = useRecentActivity();
  
  console.log('Dashboard feature detected and working!');
  console.log('Stats:', stats);
  console.log('Total items:', totalItems);
  console.log('Activities:', activities);
  
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}