import { Button } from "@/components/ui/button";

interface QuizCellProps {
  contentType: string;
  hasQuiz: boolean;
  quizTitle?: string;
  onAddQuiz: () => void;
  onCreateQuiz: () => void;
}

export const QuizCell = ({ 
  contentType, 
  hasQuiz, 
  quizTitle,
  onAddQuiz, 
  onCreateQuiz 
}: QuizCellProps) => {
  if (contentType !== 'educational') {
    return null;
  }

  if (hasQuiz) {
    return <div className="font-medium">{quizTitle || 'Quiz Attached'}</div>;
  }

  return (
    <div className="space-x-2">
      <Button variant="outline" onClick={onAddQuiz}>
        Add Existing Quiz
      </Button>
      <Button variant="outline" onClick={onCreateQuiz}>
        Create New Quiz
      </Button>
    </div>
  );
};