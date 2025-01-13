import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart3,
  BookOpen,
  Gift,
  List,
  Award,
  Database,
  Trophy,
  Key,
  Ticket,
  Users,
  Menu,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const features = [
  {
    title: "Portfolio",
    icon: BarChart3,
    comingSoon: true,
  },
  {
    title: "Watchlists",
    icon: List,
    comingSoon: false,
  },
  {
    title: "Airdrops",
    icon: Gift,
    comingSoon: true,
  },
  {
    title: "Rewards",
    icon: Award,
    comingSoon: false,
  },
  {
    title: "Data & Insights",
    icon: Database,
    comingSoon: true,
  },
  {
    title: "Rankings",
    icon: Trophy,
    comingSoon: false,
  },
  {
    title: "API Access",
    icon: Key,
    comingSoon: true,
  },
  {
    title: "Events",
    icon: Ticket,
    comingSoon: true,
  },
  {
    title: "Community",
    icon: Users,
    comingSoon: true,
  },
  {
    title: "Learn",
    icon: BookOpen,
    comingSoon: false,
  },
];

export function DashboardSidebar() {
  const navigate = useNavigate();

  const { data: userRole } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role;
    },
  });

  const isAdmin = userRole === 'admin';

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <SidebarTrigger>
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {features.map((feature) => (
                <SidebarMenuItem key={feature.title}>
                  <SidebarMenuButton
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      if (!feature.comingSoon) {
                        navigate(`/dashboard/${feature.title.toLowerCase()}`);
                      }
                    }}
                  >
                    <feature.icon className="h-4 w-4" />
                    <span>{feature.title}</span>
                    {feature.comingSoon && (
                      <span className="ml-auto text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="w-full justify-start gap-2 text-primary hover:text-primary/80"
                    onClick={() => navigate('/admin')}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}