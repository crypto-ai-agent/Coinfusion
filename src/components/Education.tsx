import { BookOpen, Shield, TrendingUp, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ProgressHeader } from "./education/ProgressHeader";
import { TopicCard } from "./education/TopicCard";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

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

const defaultTopics = [
  {
    title: "Crypto Basics",
    description: "Learn the fundamentals of cryptocurrency and blockchain technology",
    icon: BookOpen,
    link: "/education/crypto-basics",
    difficulty: "Beginner",
    points: 100
  },
  {
    title: "Security",
    description: "Understand how to keep your crypto investments safe",
    icon: Shield,
    link: "/education/security",
    difficulty: "Intermediate",
    points: 150
  },
  {
    title: "Investment",
    description: "Master the strategies for successful crypto investing",
    icon: TrendingUp,
    link: "/education/investment",
    difficulty: "Advanced",
    points: 200
  },
  {
    title: "Advanced Topics",
    description: "Dive deep into DeFi, NFTs, and emerging trends",
    icon: Lightbulb,
    link: "/education/advanced",
    difficulty: "Expert",
    points: 250
  },
];

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
        .select(`
          id,
          title,
          description,
          card_type,
          content_ids,
          display_order,
          is_active,
          style_variant
        `)
        .eq('is_active', true)
        .order('display_order');
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

  const renderGuideCollection = (card: ContentCard) => (
    <div key={card.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {defaultTopics.map((topic) => (
        <TopicCard
          key={topic.title}
          {...topic}
          isCompleted={userProgress?.completed_content.includes(topic.title) || false}
        />
      ))}
    </div>
  );

  const renderQuizSection = (card: ContentCard) => (
    <Card key={card.id} className="bg-primary/5">
      <CardHeader>
        <CardTitle>{card.title}</CardTitle>
        <CardDescription>{card.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => navigate("/quiz")}>Start Quiz</Button>
      </CardContent>
    </Card>
  );

  const renderFeaturedContent = (card: ContentCard) => (
    <Card key={card.id}>
      <CardHeader>
        <CardTitle>{card.title}</CardTitle>
        <CardDescription>{card.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Featured content will be implemented here */}
        <div className="text-muted-foreground">Coming soon...</div>
      </CardContent>
    </Card>
  );

  const renderCard = (card: ContentCard) => {
    switch (card.card_type) {
      case 'guide_collection':
        return renderGuideCollection(card);
      case 'quiz_section':
        return renderQuizSection(card);
      case 'featured_content':
        return renderFeaturedContent(card);
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
              totalCount={defaultTopics.length}
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
