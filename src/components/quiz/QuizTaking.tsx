import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizQuestion } from "./QuizQuestion";
import { QuizFeedback } from "./QuizFeedback";
import { QuizProgress } from "./QuizProgress";
import { QuizResults } from "./QuizResults";
import { useQuizProgress } from "@/hooks/useQuizProgress";

interface QuizTakingProps {
  quizId: string;
  onComplete: (score: number) => void;
}

export const QuizTaking = ({ quizId, onComplete }: QuizTakingProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const quizProgress = useQuizProgress();

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

  if (!quiz || !quiz.quiz_questions) {
    return <div>Loading quiz...</div>;
  }

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [quiz.quiz_questions[currentQuestion].id]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.quiz_questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
    } else {
      const score = calculateScore();
      quizProgress.mutate({
        userId: 'user-id', // Replace with actual user ID
        quizId: quiz.id,
        score,
        answers,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <QuizProgress
          currentQuestion={currentQuestion}
          totalQuestions={quiz.quiz_questions.length}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <QuizQuestion
          question={currentQuestionData.question}
          options={currentQuestionData.options as string[]}
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