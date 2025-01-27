import { Button } from "@/components/ui/button";
import { Award, CheckCircle } from "lucide-react";

interface ContentActionsProps {
  isCompleted: boolean;
  hasQuiz: boolean;
  readingProgress: number;
  onComplete: () => void;
  onStartQuiz: () => void;
  onBackToHub: () => void;
}

export const ContentActions = ({
  isCompleted,
  hasQuiz,
  readingProgress,
  onComplete,
  onStartQuiz,
  onBackToHub,
}: ContentActionsProps) => {
  // Show quiz button if content has a quiz and either:
  // 1. Content is already completed OR
  // 2. User has read at least 90% of the content
  const showQuizButton = hasQuiz && (isCompleted || readingProgress >= 90);
  
  // Show complete button if:
  // 1. Content is not completed AND
  // 2. User has read at least 90% of the content AND
  // 3. Either there's no quiz OR content is already completed
  const showCompleteButton = !isCompleted && readingProgress >= 90 && (!hasQuiz || isCompleted);
  
  // Show back button if:
  // 1. Content is completed AND
  // 2. There's no quiz
  const showBackButton = isCompleted && !hasQuiz;

  return (
    <div className="mt-12 flex justify-between items-center pt-6 border-t">
      {showQuizButton && (
        <Button
          onClick={onStartQuiz}
          className="w-full sm:w-auto"
        >
          <Award className="mr-2 h-4 w-4" />
          {isCompleted ? "Retake Quiz" : "Take Quiz"}
        </Button>
      )}
      
      {showCompleteButton && (
        <Button
          onClick={onComplete}
          className="w-full sm:w-auto"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark as Completed
        </Button>
      )}

      {!showQuizButton && !showCompleteButton && readingProgress < 90 && (
        <div className="text-gray-600">
          Read more to unlock quiz and completion
        </div>
      )}

      {showBackButton && (
        <Button
          onClick={onBackToHub}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Back to Education Hub
        </Button>
      )}
    </div>
  );
};