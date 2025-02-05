
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useQuizProgressTracking = (quizId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitQuizProgress = async (
    score: number, 
    answers: Record<string, string>,
    durationMinutes: number
  ) => {
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to submit quiz progress",
          variant: "destructive"
        });
        return;
      }

      // Get previous attempts count
      const { data: previousAttempts } = await supabase
        .from('quiz_attempts')
        .select('attempt_number')
        .eq('quiz_id', quizId)
        .eq('user_id', session.user.id)
        .order('attempt_number', { ascending: false })
        .limit(1);

      const attemptNumber = previousAttempts?.length ? (previousAttempts[0].attempt_number + 1) : 1;

      // Generate feedback based on score
      const feedback = score >= 80 ? 
        "Excellent work! You've mastered this topic." :
        score >= 60 ?
        "Good job! With a bit more practice, you'll master this topic." :
        "Keep practicing! Review the material and try again.";

      // Record the quiz attempt
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          user_id: session.user.id,
          score,
          answers,
          duration_minutes: durationMinutes,
          attempt_number: attemptNumber,
          feedback
        });

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

      toast({
        title: "Success",
        description: `Quiz completed! You scored ${score}%`,
      });
    } catch (error) {
      console.error('Error submitting quiz progress:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz progress",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitQuizProgress,
    isSubmitting
  };
};
