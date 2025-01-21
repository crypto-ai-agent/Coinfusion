import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Education from "@/pages/Education";
import Rankings from "@/pages/Rankings";
import News from "@/pages/News";
import CryptoDetails from "@/pages/CryptoDetails";
import ProfileManagement from "@/pages/ProfileManagement";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { EducationalContentManager } from "@/pages/admin/EducationalContentManager";
import { NewsManager } from "@/pages/admin/NewsManager";
import { QuizManager } from "@/pages/admin/QuizManager";
import WatchlistsPage from "@/pages/dashboard/Watchlists";

function App() {
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Supabase auth state
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No active session");
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem connecting to the authentication service. Please try again.",
          variant: "destructive",
        });
      }
    };

    initAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
        toast({
          title: "Signed in successfully",
          duration: 2000,
        });
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        toast({
          title: "Signed out successfully",
          duration: 2000,
        });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/watchlists" element={<WatchlistsPage />} />
        <Route path="/education" element={<Education />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/news" element={<News />} />
        <Route path="/crypto/:id" element={<CryptoDetails />} />
        <Route path="/profile" element={<ProfileManagement />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/education" element={<EducationalContentManager />} />
        <Route path="/admin/news" element={<NewsManager />} />
        <Route path="/admin/quizzes" element={<QuizManager />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;