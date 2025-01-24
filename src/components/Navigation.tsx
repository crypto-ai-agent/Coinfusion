import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavigationLink } from "./navigation/NavigationLink";
import { AuthButtons } from "./navigation/AuthButtons";
import { UserMenu } from "./navigation/UserMenu";
import { useToast } from "@/hooks/use-toast";
import { MobileMenu } from "./navigation/MobileMenu";
import { DesktopMenu } from "./navigation/DesktopMenu";

export const Navigation = () => {
  const [session, setSession] = useState(null);
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <NavigationLink href="/" className="font-bold">
            Logo
          </NavigationLink>
          <DesktopMenu />
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <UserMenu session={session} onSignOut={handleSignOut} />
          ) : (
            <AuthButtons />
          )}
          <MobileMenu session={session} onSignOut={handleSignOut} />
        </div>
      </nav>
    </header>
  );
};