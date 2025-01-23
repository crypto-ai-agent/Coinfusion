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
  return (
    <div className="mt-12 flex justify-between items-center pt-6 border-t">
      {!isCompleted ? (
        <Button
          onClick={onComplete}
          disabled={readingProgress < 90}
          className="w-full sm:w-auto"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {readingProgress < 90 
            ? "Read more to complete" 
            : "Mark as Completed"}
        </Button>
      ) : hasQuiz ? (
        <Button
          onClick={onStartQuiz}
          className="w-full sm:w-auto"
        >
          <Award className="mr-2 h-4 w-4" />
          Take Quiz
        </Button>
      ) : (
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