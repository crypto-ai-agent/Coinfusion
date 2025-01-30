import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { submitQuizAttempt } from '@/utils/quiz/quizDataService';

export const useQuizState = (quiz: any, onComplete: (score: number) => void) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (answer: string) => {
    if (!quiz?.quiz_questions[currentQuestion]) return;
    
    setAnswers(prev => ({
      ...prev,
      [quiz.quiz_questions[currentQuestion].id]: answer
    }));
  };

  const calculateScore = () => {
    if (!quiz?.quiz_questions) return 0;
    
    const totalQuestions = quiz.quiz_questions.length;
    const correctAnswers = quiz.quiz_questions.reduce((count: number, question: any) => {
      return count + (answers[question.id] === question.correct_answer ? 1 : 0);
    }, 0);
    
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const handleNext = async () => {
    if (!quiz?.quiz_questions[currentQuestion]) return;

    if (!answers[quiz.quiz_questions[currentQuestion].id]) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < quiz.quiz_questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowFeedback(false);
    } else {
      const score = calculateScore();
      try {
        await submitQuizAttempt(quiz.id, score, answers);
        setShowResults(true);
        toast({
          title: "Quiz Completed!",
          description: `You scored ${score}%!`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save quiz results. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return {
    currentQuestion,
    answers,
    showFeedback,
    showResults,
    handleAnswer,
    handleNext,
    setShowFeedback,
    calculateScore,
  };
};