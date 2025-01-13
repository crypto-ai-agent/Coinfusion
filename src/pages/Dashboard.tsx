import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { LearningProgress } from "@/components/dashboard/LearningProgress";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "lucide-react";

const DashboardContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { toggleSidebar } = useSidebar();

  const { data: userProgress, isLoading } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return null;
      }

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load your progress. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      return data;
    },
  });

  const handleFeatureRequest = async (featureName: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('feature_requests')
      .insert([{ feature_name: featureName, user_id: session.user.id }]);

    if (error && error.code !== '23505') {
      toast({
        title: "Error",
        description: "Failed to register your interest. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank you!",
      description: "Your interest has been registered. We'll notify you when this feature becomes available.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">Welcome Back!</h1>
              <p className="text-gray-600 mt-2">Track your progress and explore new features</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="flex items-center justify-center"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>

          <DashboardStats
            totalPoints={userProgress?.total_points || 0}
            currentStreak={userProgress?.current_streak || 0}
            completedContent={userProgress?.completed_content || []}
            lastActivity={userProgress?.last_activity || new Date().toISOString()}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LearningProgress
              completedContent={userProgress?.completed_content || []}
              totalTopics={4}
            />
            <RecentActivity
              completedContent={userProgress?.completed_content || []}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Portfolio Tracking', 'Airdrops', 'API Access'].map((feature) => (
              <div key={feature} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">{feature}</h3>
                <p className="text-gray-600 mb-4">Coming soon! Show your interest in this feature.</p>
                <Button 
                  onClick={() => handleFeatureRequest(feature)}
                  className="w-full"
                >
                  I'm Interested
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

export default Dashboard;