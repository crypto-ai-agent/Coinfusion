import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuizTaking } from "@/components/quiz/QuizTaking";
import { ContentBody } from "./content/ContentBody";
import { LoadingState } from "./content/LoadingState";
import { ErrorState } from "./content/ErrorState";
import { useToast } from "@/hooks/use-toast";

type ContentType = {
  id: string;
  title: string;
  content: string;
  content_type: 'guide' | 'educational';
  category: string;
  difficulty?: string;
  read_time?: string;
  description?: string;
  has_quiz?: boolean;
  published: boolean;
  quizzes?: Array<{
    id: string;
    title: string;
    points: number;
  }>;
};

export const ContentViewer = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [showQuiz, setShowQuiz] = useState(false);
  
  const { data: content, isLoading, error } = useQuery({
    queryKey: ['educational-content', id],
    queryFn: async () => {
      let { data: educationalContent, error: educationalError } = await supabase
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
        .maybeSingle();

      if (educationalError) throw educationalError;
      
      if (!educationalContent) {
        const { data: guideContent, error: guideError } = await supabase
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
          .maybeSingle();

        if (guideError) throw guideError;
        if (!guideContent) return null;
        
        return {
          ...guideContent,
          content: guideContent.description,
          content_type: 'guide',
          has_quiz: !!guideContent.quizzes?.length,
          published: true
        } as ContentType;
      }

      return educationalContent as ContentType;
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

  const handleQuizComplete = (score: number) => {
    setShowQuiz(false);
    toast({
      title: "Quiz Completed",
      description: `You scored ${score}%!`,
    });
  };

  if (isLoading) return <LoadingState />;
  if (error || !content) return <ErrorState />;

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
      <ContentBody
        content={content}
        isCompleted={isCompleted}
        onStartQuiz={() => setShowQuiz(true)}
      />
    </div>
  );
};