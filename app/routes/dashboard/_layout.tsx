import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { DashboardLayout } from "~/features/dashboard/components/layout";
import { useAuthHydrated, useIsAuthenticated } from "~/features/auth";

export default function DashboardLayoutRoute() {
  const isAuthenticated = useIsAuthenticated();
  const hasHydrated = useAuthHydrated();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until auth state is restored from localStorage before deciding redirect
    if (!hasHydrated) return;

    // If user is not authenticated, redirect to homepage
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [hasHydrated, isAuthenticated, navigate]);

  // Prevent content flash/incorrect redirect before hydration is finished
  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}