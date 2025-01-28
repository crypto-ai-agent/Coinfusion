import { useState } from "react";
import { QuizTaking } from "@/components/quiz/QuizTaking";
import { QuizSection } from "@/components/education/QuizSection";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuizContentProps {
  contentId: string;
  quizId: string;
  onQuizComplete: () => void;
}

export const QuizContent = ({ contentId, quizId, onQuizComplete }: QuizContentProps) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const { updateProgress } = useQuizProgress();
  const { toast } = useToast();

  const handleQuizComplete = async (score: number) => {
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

      await updateProgress(session.user.id, score, contentId);
      setShowQuiz(false);
      onQuizComplete();
    } catch (error) {
      console.error('Error handling quiz completion:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz progress",
        variant: "destructive"
      });
    }
  };

  if (showQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <QuizTaking 
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <QuizSection
      contentId={contentId}
      quizId={quizId}
      onStartQuiz={() => setShowQuiz(true)}
    />
  );
};