import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ProgressHeader } from "./education/ProgressHeader";
import { AuthPrompt } from "./education/AuthPrompt";
import { GuideCollection } from "./education/GuideCollection";
import { EducationalContentSection } from "./education/EducationalContentSection";
import { QuizCard } from "./education/QuizCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EducationalContentList } from "@/components/education/EducationalContentList";

export const Education = () => {
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
        .maybeSingle();
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
      return data;
    },
  });

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

  const { data: educationalContent } = useQuery({
    queryKey: ['educationalContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('educational_content')
        .select(`
          *,
          quizzes!quizzes_content_id_fkey (
            id,
            title,
            description,
            points
          )
        `)
        .eq('published', true)
        .eq('content_type', 'educational')
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

  const renderCard = (card: any) => {
    switch (card.card_type) {
      case 'guide_collection':
        const cardGuides = guides?.filter(guide => 
          card.guides?.some((g: any) => g.id === guide.id)
        ) || [];
        return (
          <GuideCollection 
            guides={cardGuides} 
            completedContent={userProgress?.completed_content || []} 
          />
        );
      case 'educational_content':
        const content = educationalContent?.filter(content => 
          card.content_ids?.includes(content.id)
        ) || [];
        return (
          <EducationalContentSection 
            content={content} 
            completedContent={userProgress?.completed_content || []} 
          />
        );
      case 'quiz_section':
        return (
          <QuizCard 
            title={card.header_title || card.title}
            description={card.header_description || card.description}
          />
        );
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
              {layout?.layout_order && Array.isArray(layout.layout_order) ? (
                layout.layout_order.map((cardId) => {
                  const card = contentCards?.find((c) => c.id === cardId);
                  return card ? renderCard(card) : null;
                })
              ) : (
                contentCards?.map(card => renderCard(card))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="educational">
            <EducationalContentList />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
