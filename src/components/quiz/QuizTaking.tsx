import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "./QuizQuestion";
import { QuizFeedback } from "./QuizFeedback";
import { QuizProgress } from "./QuizProgress";
import { QuizResults } from "./QuizResults";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

interface QuizTakingProps {
  onComplete: (score: number) => void;
}

export const QuizTaking = ({ onComplete }: QuizTakingProps) => {
  const { id: routeQuizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const quizProgress = useQuizProgress();

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', routeQuizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          quiz_questions (*)
        `)
        .eq('id', routeQuizId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: async ({ score, answers }: { score: number, answers: Record<string, string> }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) throw new Error('Not authenticated');

      // Record quiz attempt
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert([{
          user_id: sessionData.session.user.id,
          quiz_id: routeQuizId,
          score,
          answers
        }]);

      if (attemptError) throw attemptError;

      // Update user progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .update({
          total_points: supabase.sql`total_points + ${score}`,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', sessionData.session.user.id);

      if (progressError) throw progressError;
    },
    onSuccess: () => {
      toast({
        title: "Quiz completed!",
        description: "Your progress has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save quiz progress.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !quiz || !quiz.quiz_questions) {
    return <div>Loading quiz...</div>;
  }

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [quiz.quiz_questions[currentQuestion].id]: value,
    });
  };

  const handleNext = async () => {
    if (!answers[quiz.quiz_questions[currentQuestion].id]) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < quiz.quiz_questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
    } else {
      const score = calculateScore();
      await submitQuizMutation.mutateAsync({ 
        score, 
        answers 
      });
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const totalQuestions = quiz.quiz_questions.length;
    const correctAnswers = quiz.quiz_questions.reduce((count, question) => {
      return count + (answers[question.id] === question.correct_answer ? 1 : 0);
    }, 0);

    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  if (showResults) {
    return (
      <Card>
        <QuizResults
          score={calculateScore()}
          totalQuestions={quiz.quiz_questions.length}
          onFinish={() => onComplete(calculateScore())}
        />
      </Card>
    );
  }

  const currentQuestionData = quiz.quiz_questions[currentQuestion];
  const options = Array.isArray(currentQuestionData.options) 
    ? currentQuestionData.options 
    : JSON.parse(currentQuestionData.options as string);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <QuizProgress
          currentQuestion={currentQuestion + 1}
          totalQuestions={quiz.quiz_questions.length}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <QuizQuestion
          question={currentQuestionData.question}
          options={options}
          selectedAnswer={answers[currentQuestionData.id] || ''}
          onAnswerSelect={handleAnswer}
        />

        {showFeedback && (
          <QuizFeedback
            isCorrect={answers[currentQuestionData.id] === currentQuestionData.correct_answer}
            feedbackText={
              answers[currentQuestionData.id] === currentQuestionData.correct_answer
                ? currentQuestionData.feedback_correct || "Correct!"
                : currentQuestionData.feedback_incorrect || "Incorrect"
            }
            explanation={currentQuestionData.explanation}
          />
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