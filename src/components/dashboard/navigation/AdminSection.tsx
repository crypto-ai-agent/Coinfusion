import { Link, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  FileQuestion, 
  Newspaper, 
  LayoutDashboard,
  Users
} from "lucide-react";

export const AdminSection = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const adminLinks = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Educational Content",
      href: "/admin/content",
      icon: BookOpen,
    },
    {
      name: "Quizzes",
      href: "/admin/quizzes",
      icon: FileQuestion,
    },
    {
      name: "News",
      href: "/admin/news",
      icon: Newspaper,
    },
    {
      name: "User Profiles",
      href: "/admin/users",
      icon: Users,
    }
  ];

  return (
    <div className="space-y-4">
      <div className="px-2 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-sidebar-foreground">
          Admin Dashboard
        </h2>
        <div className="space-y-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};