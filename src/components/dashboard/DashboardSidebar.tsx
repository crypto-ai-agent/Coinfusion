import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { DashboardFeatures } from "./navigation/DashboardFeatures";
import { AdminSection } from "./navigation/AdminSection";
import { UserSettings } from "./navigation/UserSettings";

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <DashboardFeatures />
        <AdminSection />
        <UserSettings />
      </SidebarContent>
    </Sidebar>
  );
}