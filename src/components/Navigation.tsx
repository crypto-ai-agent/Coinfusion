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
import { Menu as MenuIcon } from "lucide-react";

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    <nav className="bg-[#1A1F2C]/95 backdrop-blur-lg fixed w-full z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavigationLink 
              href="/" 
              currentPath={location.pathname}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]"
            >
              CoinFusion
            </NavigationLink>
          </div>

          <DesktopMenu 
            navItems={navItems}
            currentPath={location.pathname}
            isAuthenticated={!!session}
            userEmail={session?.user?.email || null}
            onLogout={handleSignOut}
            onSignIn={handleSignIn}
          />

          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

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
    </nav>
  );
};