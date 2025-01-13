import { BookOpen, Shield, TrendingUp, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ProgressHeader } from "./education/ProgressHeader";
import { TopicCard } from "./education/TopicCard";
import { Button } from "./ui/button";

type CardType = "guide_collection" | "quiz_section" | "progress_tracker" | "featured_content" | "ai_highlight" | "news_collection";

type ContentCard = {
  id: string;
  title: string;
  description: string | null;
  card_type: CardType;
  content_ids: string[];
  display_order: number;
  is_active: boolean;
  style_variant: string;
};

export const Education = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProgress, setUserProgress] = useState<{
    total_points: number;
    completed_content: string[];
    current_streak: number;
    last_activity: string;
  } | null>(null);

  const { data: layout } = useQuery({
    queryKey: ['pageLayout', 'education'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_layouts')
        .select('*')
        .eq('page_name', 'education')
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: contentCards } = useQuery({
    queryKey: ['contentCards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_cards')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data as ContentCard[];
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

        if (!progressData) {
          const { data: newProgress, error: insertError } = await supabase
            .from('user_progress')
            .insert([{ 
              user_id: session.user.id,
              total_points: 0,
              completed_content: [],
              current_streak: 0,
              last_activity: new Date().toISOString()
            }])
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user progress:', insertError);
            return;
          }

          setUserProgress(newProgress);
        } else {
          setUserProgress(progressData);
        }
      }
    };

    checkAuth();
  }, []);

  const renderCard = (card: ContentCard) => {
    switch (card.card_type) {
      case 'guide_collection':
        return (
          <div key={card.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Render guide collection */}
          </div>
        );
      case 'quiz_section':
        return (
          <div key={card.id} className="bg-primary/5 p-6 rounded-lg">
            {/* Render quiz section */}
          </div>
        );
      // Add more card type renderers as needed
      default:
        return null;
    }
  };

  return (
    <section id="education" className="py-20 bg-gray-50 rounded-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Learning Paths
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Start your journey into cryptocurrency with our comprehensive guides
          </p>
          {!isAuthenticated && (
            <div className="bg-primary/5 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-2">Track Your Progress</h3>
              <p className="text-gray-600 mb-4">
                Sign in to track your progress, earn points, and unlock achievements!
              </p>
              <Button onClick={() => navigate("/auth")} variant="default">
                Sign In to Get Started
              </Button>
            </div>
          )}
          {isAuthenticated && userProgress && (
            <ProgressHeader
              totalPoints={userProgress.total_points}
              currentStreak={userProgress.current_streak}
              completedCount={userProgress.completed_content.length}
              totalCount={topics.length}
            />
          )}
        </div>

        <div className="space-y-12">
          {layout?.layout_order.map((cardId) => {
            const card = contentCards?.find((c) => c.id === cardId);
            return card ? renderCard(card) : null;
          })}
        </div>
      </div>
    </section>
  );
};
