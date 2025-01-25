import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { LearningProgress } from "@/components/dashboard/LearningProgress";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { WatchlistDashboard } from "@/components/dashboard/WatchlistDashboard";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState({
    totalPoints: 0,
    currentStreak: 0,
    completedContent: [] as string[],
    lastActivity: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUserProgress({
            totalPoints: data.total_points || 0,
            currentStreak: data.current_streak || 0,
            completedContent: data.completed_content || [],
            lastActivity: data.last_activity || new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProgress();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="pl-64 pt-16">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-100 animate-pulse rounded-lg"></div>
            <div className="h-48 bg-gray-100 animate-pulse rounded-lg"></div>
            <div className="h-48 bg-gray-100 animate-pulse rounded-lg"></div>
            <div className="h-48 bg-gray-100 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        <DashboardSidebar />
        <main className="pl-64 pt-16">
          <div className="p-8">
            <DashboardStats 
              totalPoints={userProgress.totalPoints}
              currentStreak={userProgress.currentStreak}
              completedContent={userProgress.completedContent}
              lastActivity={userProgress.lastActivity}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <WatchlistDashboard />
              <LearningProgress 
                completedContent={userProgress.completedContent}
                totalTopics={20}
              />
              <RecentActivity 
                completedContent={userProgress.completedContent}
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;