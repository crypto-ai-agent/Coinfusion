import { useParams } from "react-router-dom";
import { useState } from "react";
import { QuizTaking } from "@/components/quiz/QuizTaking";
import { ContentBody } from "./content/ContentBody";
import { LoadingState } from "./content/LoadingState";
import { ErrorState } from "./content/ErrorState";
import { useToast } from "@/hooks/use-toast";
import { useContentLoader } from "./content/ContentLoader";
import { useUserProgressTracker } from "./content/UserProgressTracker";

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
  const { toast } = useToast();
  const [showQuiz, setShowQuiz] = useState(false);
  
  const { data: content, isLoading, error } = useContentLoader(id);
  const { data: userProgress } = useUserProgressTracker(id);

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