import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavigationLink } from "./navigation/NavigationLink";
import { AuthButtons } from "./navigation/AuthButtons";
import { UserMenu } from "./navigation/UserMenu";
import { useToast } from "@/hooks/use-toast";
import { MobileMenu } from "./navigation/MobileMenu";
import { DesktopMenu } from "./navigation/DesktopMenu";
import { NavigationItem } from "./navigation/types";

const navItems: NavigationItem[] = [
  { name: "Home", href: "/" },
  { name: "Rankings", href: "/rankings" },
  { name: "Education", href: "/education" },
  { name: "News", href: "/news" },
];

export const Navigation = () => {
  const [session, setSession] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Don't show navigation on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user.user_metadata.isAdmin) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/auth');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <NavigationLink 
            href="/" 
            currentPath={location.pathname}
            className="font-bold"
          >
            Logo
          </NavigationLink>
          <DesktopMenu 
            navItems={navItems}
            currentPath={location.pathname}
            isAuthenticated={!!session}
            userEmail={session?.user?.email || null}
            onLogout={handleSignOut}
            onSignIn={handleSignIn}
          />
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <UserMenu 
              userEmail={session?.user?.email || null}
              onLogout={handleSignOut}
            />
          ) : (
            <AuthButtons 
              isAuthenticated={!!session}
              onSignIn={handleSignIn}
              onLogout={handleSignOut}
            />
          )}
          <MobileMenu 
            isOpen={isMobileMenuOpen}
            navItems={navItems}
            currentPath={location.pathname}
            isAuthenticated={!!session}
            userEmail={session?.user?.email || null}
            onItemClick={() => setIsMobileMenuOpen(false)}
            onLogout={handleSignOut}
            onSignIn={handleSignIn}
          />
        </div>
      </nav>
    </header>
  );
};