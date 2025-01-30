import { supabase } from "@/integrations/supabase/client";

export const validateQuizCompletion = async (quizId: string, userId: string) => {
  try {
    // Check if user has already completed this quiz
    const { data: attempts, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    // Return the most recent attempt if it exists
    return attempts?.[0] || null;
  } catch (error) {
    console.error('Error validating quiz completion:', error);
    return null;
  }
};

export const calculateQuizScore = (
  answers: Record<string, string>,
  correctAnswers: Record<string, string>
): number => {
  const totalQuestions = Object.keys(correctAnswers).length;
  if (totalQuestions === 0) return 0;

  const correctCount = Object.entries(answers).reduce((count, [questionId, answer]) => {
    return count + (answer === correctAnswers[questionId] ? 1 : 0);
  }, 0);

  return Math.round((correctCount / totalQuestions) * 100);
};