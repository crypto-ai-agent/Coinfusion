import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { DashboardFeatures } from "./navigation/DashboardFeatures";
import { AdminSection } from "./navigation/AdminSection";
import { SettingsSection } from "./navigation/SettingsSection";

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <DashboardFeatures />
        <AdminSection />
        <SettingsSection />
      </SidebarContent>
    </Sidebar>
  );
}