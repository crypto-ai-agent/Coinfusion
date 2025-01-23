import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuizTaking } from "@/components/quiz/QuizTaking";
import { ContentHeader } from "./content/ContentHeader";
import { ReadingProgress } from "./content/ReadingProgress";
import { ContentActions } from "./content/ContentActions";
import { Card, CardContent } from "@/components/ui/card";

export const ContentViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showQuiz, setShowQuiz] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ['guides', id],
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

  const handleQuizComplete = (score: number) => {
    setShowQuiz(false);
    toast({
      title: "Quiz Completed",
      description: `You scored ${score}%!`,
    });
    markAsCompletedMutation.mutate();
  };

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

  if (showQuiz && content.quizzes?.[0]) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <QuizTaking
            quizId={content.quizzes[0].id}
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    );
  }

  const isCompleted = userProgress?.completed_content?.includes(content.id);
  const hasQuiz = content.quizzes && content.quizzes.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <ReadingProgress />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <ContentHeader
          title={content.title}
          description={content.description}
          difficulty={content.difficulty}
          points={content.points || 0}
          readTime={content.read_time}
          isCompleted={isCompleted}
        />

        <Card className="mt-8">
          <CardContent className="prose max-w-none pt-6">
            <p className="text-lg text-gray-600 mb-8">{content.description}</p>
            
            <div className="mt-8 space-y-6">
              {content.content}
            </div>

            <ContentActions
              isCompleted={isCompleted}
              hasQuiz={hasQuiz}
              readingProgress={readingProgress}
              onComplete={() => markAsCompletedMutation.mutate()}
              onStartQuiz={() => setShowQuiz(true)}
              onBackToHub={() => navigate("/education")}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};