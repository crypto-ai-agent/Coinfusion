import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRetry?: () => void;
  onFinish: () => void;
}

export const QuizResults = ({ 
  score, 
  totalQuestions,
  onRetry,
  onFinish 
}: QuizResultsProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  return (
    <div className="text-center space-y-6 p-8">
      <Award className="w-16 h-16 mx-auto text-primary" />
      <h2 className="text-2xl font-bold">Quiz Complete!</h2>
      <div className="text-4xl font-bold text-primary">{percentage}%</div>
      <p className="text-gray-600">
        You got {score} out of {totalQuestions} questions correct
      </p>
      <div className="flex justify-center gap-4">
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        )}
        <Button onClick={onFinish}>
          Back to Content
        </Button>
      </div>
    </div>
  );
};