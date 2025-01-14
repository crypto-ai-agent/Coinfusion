import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface QuizTakingProps {
  quizId: string;
  onComplete: (score: number) => void;
}

export const QuizTaking = ({ quizId, onComplete }: QuizTakingProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();

  const { data: quiz } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          quiz_questions (*)
        `)
        .eq('id', quizId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const submitAttemptMutation = useMutation({
    mutationFn: async (score: number) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('quiz_attempts')
        .insert([{
          quiz_id: quizId,
          user_id: session.user.id,
          score,
          answers,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Quiz completed!",
        description: "Your answers have been submitted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quiz answers.",
        variant: "destructive",
      });
    },
  });

  const handleAnswer = (value: string) => {
    if (!quiz?.quiz_questions) return;
    
    setAnswers({
      ...answers,
      [quiz.quiz_questions[currentQuestion].id]: value,
    });
  };

  const handleNext = () => {
    if (!quiz?.quiz_questions) return;

    if (currentQuestion < quiz.quiz_questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
    } else {
      const score = calculateScore();
      submitAttemptMutation.mutate(score);
      onComplete(score);
    }
  };

  const calculateScore = () => {
    if (!quiz?.quiz_questions) return 0;
    
    const totalQuestions = quiz.quiz_questions.length;
    const correctAnswers = quiz.quiz_questions.reduce((count, question) => {
      return count + (answers[question.id] === question.correct_answer ? 1 : 0);
    }, 0);

    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  if (!quiz || !quiz.quiz_questions) {
    return <div>Loading quiz...</div>;
  }

  const currentQuestionData = quiz.quiz_questions[currentQuestion];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>
          Question {currentQuestion + 1} of {quiz.quiz_questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQuestionData.question}</h3>
          
          <RadioGroup
            value={answers[currentQuestionData.id]}
            onValueChange={handleAnswer}
          >
            {(currentQuestionData.options as string[]).map((option, index) => (
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
            {currentQuestion < quiz.quiz_questions.length - 1 ? "Next Question" : "Complete Quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};