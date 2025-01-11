import { NavigationLink } from "./NavigationLink";
import { AuthButtons } from "./AuthButtons";
import { NavigationItem } from "./types";

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavigationItem[];
  currentPath: string;
  isAuthenticated: boolean;
  userEmail: string | null;
  onItemClick: () => void;
  onLogout: () => void;
  onSignIn: (e: React.MouseEvent) => void;
}

export const MobileMenu = ({
  isOpen,
  navItems,
  currentPath,
  isAuthenticated,
  userEmail,
  onItemClick,
  onLogout,
  onSignIn,
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {navItems.map((item) => (
          <NavigationLink
            key={item.name}
            href={item.href}
            currentPath={currentPath}
            onClick={onItemClick}
            className="block px-3 py-2 rounded-md text-base font-medium"
          >
            {item.name}
          </NavigationLink>
        ))}
        {isAuthenticated && (
          <>
            <NavigationLink
              href="/dashboard"
              currentPath={currentPath}
              onClick={onItemClick}
              className="block px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </NavigationLink>
            <div className="px-3 py-2 text-sm text-gray-500">
              {userEmail}
            </div>
          </>
        )}
        <AuthButtons
          isAuthenticated={isAuthenticated}
          onSignIn={onSignIn}
          onLogout={onLogout}
        />
      </div>
    </div>
  );
};