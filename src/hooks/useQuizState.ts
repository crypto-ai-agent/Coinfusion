
import { useState, useEffect } from 'react';
import { useQuizProgressTracking } from './useQuizProgressTracking';
import { validateQuizCompletion, calculateQuizScore } from '../services/quizValidation';
import { useToast } from './use-toast';

export const useQuizState = (quizId: string) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const { submitQuizProgress, isSubmitting } = useQuizProgressTracking(quizId);
  const { toast } = useToast();

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitQuiz = async (correctAnswers: Record<string, string>) => {
    if (isSubmitting) return;

    const score = calculateQuizScore(answers, correctAnswers);
    const endTime = new Date();
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

    await submitQuizProgress(score, answers, durationMinutes);
    setIsComplete(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
    setStartTime(new Date());
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
