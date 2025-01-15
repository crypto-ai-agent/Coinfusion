import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ProgressHeader } from "./education/ProgressHeader";
import { AuthPrompt } from "./education/AuthPrompt";
import { GuideCollection } from "./education/GuideCollection";
import { QuizCard } from "./education/QuizCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EducationalContentList } from "@/components/education/EducationalContentList";
import { PopularGuides } from "@/components/PopularGuides";

export const Education = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProgress, setUserProgress] = useState<{
    total_points: number;
    completed_content: string[];
    current_streak: number;
    last_activity: string;
  } | null>(null);

  const { data: guides } = useQuery({
    queryKey: ['guides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .order('created_at');
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (session) {
        const { data: progressData, error } = await supabase
          .from('user_progress')
          .select('total_points, completed_content, current_streak, last_activity')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user progress:', error);
          return;
        }

        setUserProgress(progressData);
      }
    };

    checkAuth();
  }, []);

  return (
    <section id="education" className="py-20 bg-gray-50 rounded-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Educational Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Expand your cryptocurrency knowledge
          </p>
          {!isAuthenticated && <AuthPrompt />}
          {isAuthenticated && userProgress && (
            <ProgressHeader
              totalPoints={userProgress.total_points}
              currentStreak={userProgress.current_streak}
              completedCount={userProgress.completed_content.length}
              totalCount={guides?.length || 0}
            />
          )}
        </div>

        <Tabs defaultValue="guides" className="mt-8">
          <TabsList>
            <TabsTrigger value="guides">Learning Guides</TabsTrigger>
            <TabsTrigger value="educational">Educational Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides">
            <div className="space-y-12">
              <GuideCollection 
                guides={guides || []} 
                completedContent={userProgress?.completed_content || []} 
              />
              <QuizCard 
                title="Knowledge Check"
                description="Put your crypto knowledge to the test"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="educational">
            <EducationalContentList />
          </TabsContent>
        </Tabs>

        <div className="mt-16">
          <PopularGuides />
        </div>
      </div>
    </section>
  );
};