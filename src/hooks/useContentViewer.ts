import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useContentViewer = (id: string | undefined) => {
  return useQuery({
    queryKey: ['guides', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guides')
        .select(`
          *,
          quizzes (
            id,
            title,
            points
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });
};