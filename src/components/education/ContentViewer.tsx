import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuizTaking } from "@/components/quiz/QuizTaking";
import { ContentHeader } from "./content/ContentHeader";
import { ContentActions } from "./content/ContentActions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Added Button import
import { useMarkAsCompleted } from "@/hooks/useMarkAsCompleted";
import { ReadingProgressBar } from "./content/ReadingProgressBar";
import { useToast } from "@/hooks/use-toast";

// Define a type for the combined content structure
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
  author_id?: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
};

export const ContentViewer = () => {
  const { id, category } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showQuiz, setShowQuiz] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  
  const { data: content, isLoading, error } = useQuery({
    queryKey: ['educational-content', id],
    queryFn: async () => {
      // First try educational_content table
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
      
      // If not found in educational_content, try guides table
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
        
        // Transform guide data to match educational content structure
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

  if (error || !content) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Card className="text-center p-6">
          <h2 className="text-xl font-semibold mb-2">Content Not Found</h2>
          <p className="text-gray-600 mb-4">
            The content you're looking for might have been moved or deleted.
          </p>
          <Button onClick={() => navigate("/education")}>
            Return to Education Hub
          </Button>
        </Card>
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
          difficulty={content.difficulty || "intermediate"}
          points={content.quizzes?.[0]?.points || 0}
          readTime={content.read_time || "5 min"}
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