import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { QuizTaking } from "@/components/quiz/QuizTaking";
import { ContentBody } from "./content/ContentBody";
import { LoadingState } from "./content/LoadingState";
import { ErrorState } from "./content/ErrorState";
import { useToast } from "@/hooks/use-toast";
import { useContentLoader } from "./content/ContentLoader";
import { useUserProgressTracker } from "./content/UserProgressTracker";
import { QuizSection } from "./QuizSection";

export type ContentType = {
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showQuiz, setShowQuiz] = useState(false);
  
  const { data: content, isLoading, error } = useContentLoader(id);
  const { data: userProgress } = useUserProgressTracker(id);

  const handleQuizComplete = async (score: number) => {
    setShowQuiz(false);
    
    // Update user progress and points
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to save quiz progress",
          variant: "destructive"
        });
        return;
      }

      // Calculate points based on score percentage
      const earnedPoints = Math.round((score / 100) * (content?.quizzes?.[0]?.points || 10));

      // Update user progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: session.user.id,
          total_points: earnedPoints,
          completed_content: userProgress?.completed_content 
            ? [...userProgress.completed_content, content?.id]
            : [content?.id],
          last_activity: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (progressError) throw progressError;

      toast({
        title: "Quiz Completed!",
        description: `You scored ${score}% and earned ${earnedPoints} points!`,
      });
    } catch (error) {
      console.error('Error saving quiz progress:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz progress",
        variant: "destructive"
      });
    }

    navigate("/education");
  };

  if (isLoading) return <LoadingState />;
  if (error || !content) return <ErrorState />;

  const isCompleted = userProgress?.completed_content?.includes(content.id);
  const quizId = content.quizzes?.[0]?.id;

  if (showQuiz && quizId) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <QuizTaking 
            quizId={quizId} 
            onComplete={handleQuizComplete} 
          />
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
      {content.has_quiz && quizId && (
        <QuizSection
          contentId={content.id}
          quizId={quizId}
          onStartQuiz={() => setShowQuiz(true)}
        />
      )}
    </div>
  );
};