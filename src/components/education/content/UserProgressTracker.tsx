import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserProgressTracker = (contentId: string | undefined) => {
  return useQuery({
    queryKey: ['user-progress', contentId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('user_progress')
        .select('completed_content')
        .eq('user_id', session.user.id)
        .single();

      if (error) return null;
      return data;
    },
  });
};