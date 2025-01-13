import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuizViewProps {
  quiz: {
    id: string;
    title: string;
    description: string;
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correct_answer: string;
      explanation: string;
      feedback_correct: string;
      feedback_incorrect: string;
    }>;
    points: number;
  };
  onComplete: (score: number) => void;
}

export const QuizView = ({ quiz, onComplete }: QuizViewProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [quiz.questions[currentQuestion].id]: value,
    });
  };

  const handleNext = () => {
    if (!answers[quiz.questions[currentQuestion].id]) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    const score = calculateScore();
    const percentage = (score / quiz.questions.length) * 100;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('quiz_attempts')
        .insert([{
          quiz_id: quiz.id,
          user_id: session.user.id,
          score: percentage,
          answers: answers,
        }]);

      if (error) throw error;

      // Update user progress
      const pointsEarned = Math.round((percentage / 100) * quiz.points);
      const { error: progressError } = await supabase
        .from('user_progress')
        .update({
          total_points: supabase.raw(`total_points + ${pointsEarned}`),
          last_activity: new Date().toISOString(),
        })
        .eq('user_id', session.user.id);

      if (progressError) throw progressError;

      toast({
        title: "Quiz completed!",
        description: `You scored ${percentage}% and earned ${pointsEarned} points!`,
      });

      setIsCompleted(true);
      onComplete(percentage);
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz results. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateScore = () => {
    return quiz.questions.reduce((score, question) => {
      return score + (answers[question.id] === question.correct_answer ? 1 : 0);
    }, 0);
  };

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
        <p className="text-gray-600">{quiz.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm text-gray-500">
            Points available: {quiz.points}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQuestionData.question}</h3>
          
          <RadioGroup
            value={answers[currentQuestionData.id]}
            onValueChange={handleAnswer}
          >
            {currentQuestionData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {showFeedback && (
          <div className={`p-4 rounded-lg ${
            answers[currentQuestionData.id] === currentQuestionData.correct_answer
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            <p className="font-medium">
              {answers[currentQuestionData.id] === currentQuestionData.correct_answer
                ? currentQuestionData.feedback_correct
                : currentQuestionData.feedback_incorrect}
            </p>
            {currentQuestionData.explanation && (
              <p className="mt-2 text-sm">{currentQuestionData.explanation}</p>
            )}
          </div>
        )}

        <div className="flex justify-between">
          {!showFeedback && (
            <Button
              onClick={() => setShowFeedback(true)}
              variant="outline"
            >
              Check Answer
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="ml-auto"
          >
            {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Complete Quiz"}
          </Button>
        </div>
      </div>
    </Card>
  );
};