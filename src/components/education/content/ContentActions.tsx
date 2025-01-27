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
  const showQuizButton = hasQuiz && (isCompleted || readingProgress >= 90);
  const showCompleteButton = !isCompleted && readingProgress >= 90;
  const showBackButton = isCompleted && !hasQuiz;

  return (
    <div className="mt-12 flex justify-between items-center pt-6 border-t">
      {showQuizButton && (
        <Button
          onClick={onStartQuiz}
          className="w-full sm:w-auto"
        >
          <Award className="mr-2 h-4 w-4" />
          Take Quiz
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

      {!showQuizButton && !showCompleteButton && (
        <div className="text-gray-600">
          {readingProgress < 90 ? "Read more to complete" : ""}
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