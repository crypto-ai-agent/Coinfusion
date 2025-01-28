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

interface QuizTakingProps {
  onComplete: (score: number) => void;
}

export const QuizTaking = ({ onComplete }: QuizTakingProps) => {
  const { id: quizId } = useParams();

  const { data: quiz, isLoading } = useQuery({
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

  if (isLoading || !quiz) {
    return <div>Loading quiz...</div>;
  }

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
          currentQuestion={currentQuestion}
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