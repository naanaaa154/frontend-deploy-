import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}