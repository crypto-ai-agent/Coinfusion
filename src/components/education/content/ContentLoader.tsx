import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContentType } from "../ContentViewer";

export const useContentLoader = (id: string | undefined) => {
  return useQuery({
    queryKey: ['educational-content', id],
    queryFn: async () => {
      let { data: educationalContent, error: educationalError } = await supabase
        .from('educational_content')
        .select(`
          *,
          quizzes (
            id,
            title,
            points
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (educationalError) throw educationalError;
      
      if (!educationalContent) {
        const { data: guideContent, error: guideError } = await supabase
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
          .maybeSingle();

        if (guideError) throw guideError;
        if (!guideContent) return null;
        
        return {
          ...guideContent,
          content: guideContent.description,
          content_type: 'guide',
          has_quiz: !!guideContent.quizzes?.length,
          published: true
        } as ContentType;
      }

      return educationalContent as ContentType;
    },
  });
};