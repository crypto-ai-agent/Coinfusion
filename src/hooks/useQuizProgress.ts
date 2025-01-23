import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useQuizProgress = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, quizId, score, answers }: {
      userId: string;
      quizId: string;
      score: number;
      answers: Record<string, string>;
    }) => {
      const { error } = await supabase
        .from('quiz_attempts')
        .insert([{
          user_id: userId,
          quiz_id: quizId,
          score,
          answers,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      toast({
        title: "Quiz completed!",
        description: "Your answers have been submitted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quiz answers.",
        variant: "destructive",
      });
    },
  });
};