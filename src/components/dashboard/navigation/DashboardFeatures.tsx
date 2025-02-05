
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
  History,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
    title: "Quiz History",
    icon: History,
    comingSoon: false,
    path: "/quiz-history",
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

export function DashboardFeatures() {
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Features
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {features.map((feature) => (
            <SidebarMenuItem key={feature.title}>
              <SidebarMenuButton
                className="w-full justify-start gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2 text-sm"
                onClick={() => {
                  if (!feature.comingSoon) {
                    navigate(feature.path || `/dashboard/${feature.title.toLowerCase()}`);
                  }
                }}
                disabled={feature.comingSoon}
              >
                <feature.icon className="h-4 w-4" />
                <span>{feature.title}</span>
                {feature.comingSoon && (
                  <span className="ml-auto text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
