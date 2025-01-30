import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useQuizProgressTracking = (quizId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitQuizProgress = async (score: number, answers: Record<string, string>) => {
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

      // First record the quiz attempt
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          user_id: session.user.id,
          score,
          answers
        });

      if (attemptError) throw attemptError;

      // Only update progress if quiz attempt was recorded
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: session.user.id,
          total_points: score, // Points based on actual score
          last_activity: new Date().toISOString(),
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