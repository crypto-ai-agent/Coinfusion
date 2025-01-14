import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface QuizSectionProps {
  contentId: string;
  quizId?: string;
}

export const QuizSection = ({ contentId, quizId }: QuizSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 p-6 bg-primary/5 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Test Your Knowledge</h3>
      <p className="text-gray-600 mb-4">
        Ready to check your understanding? Take the quiz to earn points and track your progress!
      </p>
      <Button 
        onClick={() => navigate(`/quiz/${quizId}`)}
        className="w-full md:w-auto"
      >
        Start Quiz
      </Button>
    </div>
  );
};