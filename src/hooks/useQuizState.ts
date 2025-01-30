import { useState } from 'react';
import { useQuizProgressTracking } from './useQuizProgressTracking';
import { validateQuizCompletion, calculateQuizScore } from '../services/quizValidation';
import { useToast } from './use-toast';

export const useQuizState = (quizId: string) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const { submitQuizProgress, isSubmitting } = useQuizProgressTracking(quizId);
  const { toast } = useToast();

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitQuiz = async (correctAnswers: Record<string, string>) => {
    if (isSubmitting) return;

    const score = calculateQuizScore(answers, correctAnswers);
    await submitQuizProgress(score, answers);
    setIsComplete(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
  };

  return {
    currentQuestion,
    setCurrentQuestion,
    answers,
    handleAnswer,
    submitQuiz,
    resetQuiz,
    isComplete,
    isSubmitting
  };
};