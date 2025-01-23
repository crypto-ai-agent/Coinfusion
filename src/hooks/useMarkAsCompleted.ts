import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useMarkAsCompleted = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data: userProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (!userProgress) throw new Error("User progress not found");

      const { error } = await supabase
        .from('user_progress')
        .update({
          completed_content: [...(userProgress.completed_content || []), 'content-id'],
          total_points: (userProgress.total_points || 0) + 10,
          last_activity: new Date().toISOString(),
          current_streak: (userProgress.current_streak || 0) + 1
        })
        .eq('user_id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      toast({
        title: "Progress Updated",
        description: "Congratulations! You've completed this content!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    },
  });
};