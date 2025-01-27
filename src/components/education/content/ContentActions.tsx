import { Button } from "@/components/ui/button";
import { Award, CheckCircle } from "lucide-react";

interface ContentActionsProps {
  isCompleted: boolean;
  hasQuiz: boolean;
  onComplete: () => void;
  onStartQuiz: () => void;
  onBackToHub: () => void;
}

export const ContentActions = ({
  isCompleted,
  hasQuiz,
  onComplete,
  onStartQuiz,
  onBackToHub,
}: ContentActionsProps) => {
  // Show quiz button if content has a quiz
  const showQuizButton = hasQuiz;
  
  // Show complete button if content is not completed
  const showCompleteButton = !isCompleted;

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

      {isCompleted && !hasQuiz && (
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