import { NavigationLink } from "./NavigationLink";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";
import { NavigationItem } from "./types";

interface DesktopMenuProps {
  navItems: NavigationItem[];
  currentPath: string;
  isAuthenticated: boolean;
  userEmail: string | null;
  onLogout: () => void;
  onSignIn: (e: React.MouseEvent) => void;
}

export const DesktopMenu = ({
  navItems,
  currentPath,
  isAuthenticated,
  userEmail,
  onLogout,
  onSignIn,
}: DesktopMenuProps) => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      {navItems.map((item) => (
        <NavigationLink
          key={item.name}
          href={item.href}
          currentPath={currentPath}
          className="px-3 py-2 rounded-md text-sm font-medium"
        >
          {item.name}
        </NavigationLink>
      ))}
      {isAuthenticated && (
        <NavigationLink
          href="/dashboard"
          currentPath={currentPath}
          className="px-3 py-2 rounded-md text-sm font-medium"
        >
          Dashboard
        </NavigationLink>
      )}
      {isAuthenticated ? (
        <UserMenu userEmail={userEmail} onLogout={onLogout} />
      ) : (
        <Button
          variant="default"
          onClick={onSignIn}
          className="ml-4"
        >
          Sign In
        </Button>
      )}
    </div>
  );
};