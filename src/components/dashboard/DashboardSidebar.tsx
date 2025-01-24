import { Link, useLocation } from "react-router-dom";
import { AdminSection } from "./navigation/AdminSection";
import { DashboardFeatures } from "./navigation/DashboardFeatures";
import { SettingsSection } from "./navigation/SettingsSection";

export const DashboardSidebar = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-sidebar-background">
      <div className="flex h-full flex-col gap-4 p-4">
        {isAdminRoute ? (
          <AdminSection />
        ) : (
          <>
            <DashboardFeatures />
            <SettingsSection />
          </>
        )}
      </div>
    </div>
  );
}