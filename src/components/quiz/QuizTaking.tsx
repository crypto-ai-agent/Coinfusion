import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "./QuizQuestion";
import { QuizFeedback } from "./QuizFeedback";
import { QuizProgress } from "./QuizProgress";
import { QuizResults } from "./QuizResults";
import { useQuizState } from "./hooks/useQuizState";
import { fetchQuiz } from "@/utils/quiz/quizDataService";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface QuizTakingProps {
  onComplete: (score: number) => void;
}

export const QuizTaking = ({ onComplete }: QuizTakingProps) => {
  const { id: quizId } = useParams();
  const { toast } = useToast();

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => fetchQuiz(quizId || ''),
    enabled: !!quizId,
  });

  const {
    currentQuestion,
    answers,
    showFeedback,
    showResults,
    handleAnswer,
    handleNext,
    setShowFeedback,
    calculateScore,
  } = useQuizState(quiz, onComplete);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-red-600">Error Loading Quiz</h2>
          <p className="text-gray-600 mt-2">Unable to load the quiz. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <Card className="max-w-2xl mx-auto">
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
    <Card className="max-w-2xl mx-auto">
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
              disabled={!answers[currentQuestionData.id]}
            >
              Check Answer
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="ml-auto"
            disabled={!answers[currentQuestionData.id]}
          >
            {currentQuestion < quiz.quiz_questions.length - 1 ? "Next Question" : "Complete Quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};