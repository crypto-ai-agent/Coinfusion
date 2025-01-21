import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export const ContentViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [readingProgress, setReadingProgress] = useState(0);

  // Fetch the content and associated quiz
  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ['educational-content', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guides')
        .select(`
          *,
          quizzes (
            id,
            title,
            points
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch user progress
  const { data: userProgress } = useQuery({
    queryKey: ['user-progress'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) return null;
      return data;
    },
  });

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mark content as completed
  const markAsCompletedMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const completedContent = userProgress?.completed_content || [];
      if (completedContent.includes(id!)) return;

      const { error } = await supabase
        .from('user_progress')
        .update({
          completed_content: [...completedContent, id],
          total_points: (userProgress?.total_points || 0) + (content?.points || 0),
          last_activity: new Date().toISOString(),
          current_streak: (userProgress?.current_streak || 0) + 1
        })
        .eq('user_id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      toast({
        title: "Progress Updated",
        description: `Congratulations! You've earned ${content?.points} points!`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (contentLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <p className="text-center text-gray-600">Content not found</p>
      </div>
    );
  }

  const isCompleted = userProgress?.completed_content?.includes(content.id);
  const hasQuiz = content.quizzes && content.quizzes.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/education")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Education Hub
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div>
                <CardTitle className="text-3xl font-bold text-primary">
                  {content.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{content.difficulty}</Badge>
                  <Badge variant="outline">{content.points} points</Badge>
                  {content.read_time && (
                    <Badge variant="outline">{content.read_time}</Badge>
                  )}
                </div>
              </div>
              {isCompleted && (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Completed
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-8">{content.description}</p>
            
            <div className="mt-8 space-y-6">
              {/* Content sections would go here */}
              <p>{content.content || "Content coming soon..."}</p>
            </div>

            <div className="mt-12 flex justify-between items-center pt-6 border-t">
              {!isCompleted ? (
                <Button
                  onClick={() => markAsCompletedMutation.mutate()}
                  disabled={readingProgress < 90}
                  className="w-full sm:w-auto"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {readingProgress < 90 
                    ? "Read more to complete" 
                    : "Mark as Completed"}
                </Button>
              ) : hasQuiz ? (
                <Button
                  onClick={() => navigate(`/quiz/${content.quizzes[0].id}`)}
                  className="w-full sm:w-auto"
                >
                  <Award className="mr-2 h-4 w-4" />
                  Take Quiz
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/education")}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Back to Education Hub
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};