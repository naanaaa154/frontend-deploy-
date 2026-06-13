import type { Route } from "./+types/_index";
import { DashboardOverview } from "~/features/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Notuly" },
    { name: "description", content: "Dashboard Notuly - Kelola catatan dan rekaman suara Anda" },
  ];
}

export default function DashboardIndex() {
  return <DashboardOverview />;
}