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
  // Lower the threshold to 20% for testing purposes
  const READING_THRESHOLD = 20;
  
  // Show quiz button if content has a quiz and either:
  // 1. Content is already completed OR
  // 2. User has read at least the threshold amount
  const showQuizButton = hasQuiz && (isCompleted || readingProgress >= READING_THRESHOLD);
  
  // Show complete button if:
  // 1. Content is not completed AND
  // 2. User has read at least the threshold amount
  const showCompleteButton = !isCompleted && readingProgress >= READING_THRESHOLD;

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

      {!showQuizButton && !showCompleteButton && readingProgress < READING_THRESHOLD && (
        <div className="text-gray-600">
          Read {READING_THRESHOLD}% of the content to unlock quiz and completion
        </div>
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