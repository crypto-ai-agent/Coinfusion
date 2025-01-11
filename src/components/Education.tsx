import { BookOpen, Shield, TrendingUp, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProgressHeader } from "./education/ProgressHeader";
import { TopicCard } from "./education/TopicCard";
import { Button } from "./ui/button";

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

  const topics = [
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {topics.map((topic) => (
            <TopicCard
              key={topic.title}
              {...topic}
              isCompleted={userProgress?.completed_content.includes(topic.title) || false}
            />
          ))}
        </div>
      </div>
    </section>
  );
};