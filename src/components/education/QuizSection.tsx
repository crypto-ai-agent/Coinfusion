import { Button } from "@/components/ui/button";

interface QuizSectionProps {
  contentId: string;
  quizId: string;
  onStartQuiz: () => void;
}

export const QuizSection = ({ contentId, quizId, onStartQuiz }: QuizSectionProps) => {
  return (
    <div className="mt-8 p-6 bg-primary/5 rounded-lg max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Test Your Knowledge</h3>
      <p className="text-gray-600 mb-4">
        Ready to check your understanding? Take the quiz to earn points and track your progress!
      </p>
      <Button 
        onClick={onStartQuiz}
        className="w-full md:w-auto"
      >
        Start Quiz
      </Button>
    </div>
  );
};