import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuizAttempt {
  userId: string;
  quizId: string;
  score: number;
  answers: Record<string, string>;
}

export const useQuizProgress = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, quizId, score, answers }: QuizAttempt) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('quiz_attempts')
        .insert([{
          user_id: session.user.id,
          quiz_id: quizId,
          score,
          answers,
        }]);

      if (error) throw error;

      // Update user progress
      const { data: userProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (userProgress) {
        await supabase
          .from('user_progress')
          .update({
            total_points: (userProgress.total_points || 0) + Math.round(score / 10),
            last_activity: new Date().toISOString(),
          })
          .eq('user_id', session.user.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      toast({
        title: "Quiz completed!",
        description: "Your progress has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save quiz progress.",
        variant: "destructive",
      });
    },
  });
};