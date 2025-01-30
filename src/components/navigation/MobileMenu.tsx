import { NavigationLink } from "./NavigationLink";
import { AuthButtons } from "./AuthButtons";
import { NavigationItem } from "./types";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  navItems,
  currentPath,
  isAuthenticated,
  userEmail,
  onItemClick,
  onLogout,
  onSignIn,
}: MobileMenuProps) => {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64">
          <div className="flex flex-col gap-4 mt-4">
            {navItems.map((item) => (
              <NavigationLink
                key={item.name}
                href={item.href}
                currentPath={currentPath}
                onClick={onItemClick}
                className="px-3 py-2 text-base font-medium hover:text-primary"
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
                  className="px-3 py-2 text-base font-medium hover:text-primary"
                >
                  Dashboard
                </NavigationLink>
                <div className="px-3 py-2 text-sm text-muted-foreground">
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
        </SheetContent>
      </Sheet>
    </div>
  );
};