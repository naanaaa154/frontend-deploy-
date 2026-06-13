import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Home,
  FileText,
  Mic,
  FileUp,
  Sparkles,
  Shield,
  Settings,
  User,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useUser, useAuthActions } from "~/features/auth";
import { ThemeToggle } from "~/components/theme-toggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  // { name: "Notes", href: "/dashboard/notes", icon: FileText },
  // { name: "Voice", href: "/dashboard/voice", icon: Mic },
  { name: "Daftar Rapat", href: "/dashboard/transcripts", icon: FileText },
  { name: "Upload Transkrip", href: "/dashboard/transcripts/upload", icon: FileUp },
  { name: "AI Assistant", href: "/dashboard/ai", icon: Sparkles },
  // { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Default to open so the sidebar is visible in typical desktop/tablet web sizes.
  // On small screens it will still behave like an off-canvas drawer.
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUser();
  const { logout } = useAuthActions();

  const menuItems = React.useMemo(() => {
    const items = [...navigation];
    if (user?.role === "superadmin") {
      items.push({ name: "User Approval", href: "/dashboard/admin/users", icon: Shield });
    }
    return items;
  }, [user?.role]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#034391] to-[#0256b8] rounded-xl flex items-center justify-center shadow-md">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white font-jakarta">Notuly</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isExactMatch = item.href === "/dashboard" || item.href === "/dashboard/transcripts";
              const isActive = isExactMatch
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-[#034391] to-[#0256b8] text-white shadow-md"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 pb-4 pt-4">
          <div className="px-4">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors mb-3 cursor-default">
              <div className="w-10 h-10 bg-gradient-to-br from-[#034391] to-[#0256b8] rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all rounded-lg font-medium"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm relative z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white hidden md:block">
                Dashboard
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{user?.username}</span></span>
              </div>
              <ThemeToggle className="hover:bg-gray-100 dark:hover:bg-gray-700" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}