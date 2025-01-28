import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const fetchQuiz = async (quizId: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      quiz_questions (
        id,
        question,
        options,
        correct_answer,
        explanation,
        feedback_correct,
        feedback_incorrect
      )
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

  // Save quiz attempt
  const { error: attemptError } = await supabase
    .from('quiz_attempts')
    .insert([{
      quiz_id: quizId,
      user_id: session.user.id,
      score,
      answers
    }]);

  if (attemptError) throw attemptError;

  // Update user progress with points
  const { error: progressError } = await supabase
    .from('user_progress')
    .upsert({
      user_id: session.user.id,
      total_points: score,
      last_activity: new Date().toISOString(),
      current_streak: 1
    }, {
      onConflict: 'user_id'
    });

  if (progressError) throw progressError;
};