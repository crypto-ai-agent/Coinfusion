import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuizTaking } from "@/components/quiz/QuizTaking";
import { ContentHeader } from "./content/ContentHeader";
import { ContentActions } from "./content/ContentActions";
import { Card, CardContent } from "@/components/ui/card";
import { useMarkAsCompleted } from "@/hooks/useMarkAsCompleted";
import { ReadingProgressBar } from "./content/ReadingProgressBar";
import { useToast } from "@/hooks/use-toast";

export const ContentViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showQuiz, setShowQuiz] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  
  const { data: content, isLoading } = useQuery({
    queryKey: ['educational-content', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('educational_content')
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
    queryKey: ['user-progress', id],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('user_progress')
        .select('completed_content')
        .eq('user_id', session.user.id)
        .single();

      if (error) return null;
      return data;
    },
  });

  const markAsCompletedMutation = useMarkAsCompleted();

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('content-body');
      if (element) {
        const { scrollTop, scrollHeight, clientHeight } = element;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setReadingProgress(Math.min(progress, 100));
      }
    };

    const element = document.getElementById('content-body');
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleQuizComplete = (score: number) => {
    setShowQuiz(false);
    toast({
      title: "Quiz Completed",
      description: `You scored ${score}%!`,
    });
    markAsCompletedMutation.mutate();
  };

  if (isLoading) {
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

  if (showQuiz && content.quizzes?.[0]) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <QuizTaking onComplete={handleQuizComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <ReadingProgressBar value={readingProgress} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <ContentHeader
          title={content.title}
          description={content.content.substring(0, 150) + '...'}
          difficulty="intermediate"
          points={content.quizzes?.[0]?.points || 0}
          readTime="5 min"
          isCompleted={isCompleted}
        />

        <Card className="mt-8">
          <CardContent className="prose max-w-none pt-6">
            <div id="content-body" className="max-h-[600px] overflow-y-auto p-4">
              <div className="space-y-6" dangerouslySetInnerHTML={{ __html: content.content }} />
            </div>

            <ContentActions
              isCompleted={isCompleted}
              hasQuiz={!!content.quizzes?.length}
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
