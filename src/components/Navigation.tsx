import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { DesktopMenu } from "./navigation/DesktopMenu";
import { MobileMenu } from "./navigation/MobileMenu";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUserEmail(session?.user?.email ?? null);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        setUserEmail(session?.user?.email ?? null);
        toast({
          title: "Signed in successfully",
          duration: 2000,
        });
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserEmail(null);
        toast({
          title: "Signed out successfully",
          duration: 2000,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserEmail(null);
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    navigate("/auth");
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Education", href: "/education" },
    { name: "Rankings", href: "/rankings" },
    { name: "News", href: "/news" },
  ];

  return (
    <nav className="bg-[#1A1F2C]/80 backdrop-blur-lg fixed w-full z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]">
              CoinFusion
            </Link>
          </div>
          
          <DesktopMenu
            navItems={navItems}
            currentPath={location.pathname}
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onLogout={handleLogout}
            onSignIn={handleSignIn}
          />

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isOpen}
        navItems={navItems}
        currentPath={location.pathname}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onItemClick={() => setIsOpen(false)}
        onLogout={handleLogout}
        onSignIn={handleSignIn}
      />
    </nav>
  );
};