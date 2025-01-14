import { BookOpen, Shield, TrendingUp, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ProgressHeader } from "./education/ProgressHeader";
import { TopicCard } from "./education/TopicCard";
import { QuizSection } from "./education/QuizSection";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

const iconMap = {
  'Crypto Basics': BookOpen,
  'Security': Shield,
  'Investment': TrendingUp,
  'Advanced Topics': Lightbulb,
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
          quizzes (
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

  const renderGuideCollection = (card: any) => {
    const cardGuides = guides?.filter(guide => 
      card.guides?.some((g: any) => g.id === guide.id)
    ) || [];

    return (
      <div key={card.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cardGuides.map((guide) => (
          <TopicCard
            key={guide.id}
            id={guide.id}
            title={guide.title}
            description={guide.description}
            icon={iconMap[guide.category as keyof typeof iconMap] || BookOpen}
            link={`/education/${guide.category.toLowerCase().replace(' ', '-')}/${guide.id}`}
            difficulty={guide.difficulty}
            points={guide.points}
            readTime={guide.read_time}
            isCompleted={userProgress?.completed_content.includes(guide.id) || false}
          />
        ))}
      </div>
    );
  };

  const renderEducationalContent = (card: any) => {
    const content = educationalContent?.filter(content => 
      card.content_ids?.includes(content.id)
    ) || [];

    return (
      <div key={card.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {content.map((item) => (
          <div key={item.id} className="space-y-4">
            <TopicCard
              id={item.id}
              title={item.title}
              description={item.content}
              icon={iconMap[item.category as keyof typeof iconMap] || BookOpen}
              link={`/education/content/${item.id}`}
              difficulty="Intermediate"
              points={item.quizzes?.[0]?.points || 0}
              isCompleted={userProgress?.completed_content.includes(item.id) || false}
            />
            {item.has_quiz && (
              <QuizSection contentId={item.id} quizId={item.quiz_id} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderQuizSection = (card: any) => (
    <Card key={card.id} className="bg-primary/5">
      <CardHeader>
        <CardTitle>{card.header_title || card.title}</CardTitle>
        <CardDescription>{card.header_description || card.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => navigate("/quiz")}>Start Quiz</Button>
      </CardContent>
    </Card>
  );

  const renderCard = (card: any) => {
    switch (card.card_type) {
      case 'guide_collection':
        return renderGuideCollection(card);
      case 'educational_content':
        return renderEducationalContent(card);
      case 'quiz_section':
        return renderQuizSection(card);
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
              totalCount={guides?.length || 0}
            />
          )}
        </div>

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
      </div>
    </section>
  );
};