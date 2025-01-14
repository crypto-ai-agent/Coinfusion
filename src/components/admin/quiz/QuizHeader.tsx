import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface QuizHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  onAddNew?: () => void;
}

export const QuizHeader = ({ title, showBackButton, onBack, onAddNew }: QuizHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quizzes
          </Button>
        )}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {onAddNew && (
        <Button onClick={onAddNew}>
          Create New Quiz
        </Button>
      )}
    </div>
  );
};