import { supabase } from "@/integrations/supabase/client";

export const fetchQuiz = async (quizId: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      quiz_questions (*)
    `)
    .eq('id', quizId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const submitQuizAttempt = async (
  quizId: string,
  score: number,
  answers: Record<string, string>
) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { error: attemptError } = await supabase
    .from('quiz_attempts')
    .insert([{
      quiz_id: quizId,
      user_id: session.user.id,
      score,
      answers
    }]);

  if (attemptError) throw attemptError;

  // Update user progress
  const { error: progressError } = await supabase
    .from('user_progress')
    .update({
      total_points: score,
      last_activity: new Date().toISOString()
    })
    .eq('user_id', session.user.id);

  if (progressError) throw progressError;
};