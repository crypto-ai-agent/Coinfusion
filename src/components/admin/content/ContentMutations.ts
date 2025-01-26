import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Content } from "@/types/content";

export const useContentMutations = (contentType: 'guide' | 'educational') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (updatedContent: Content) => {
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Updating content:', updatedContent);
      
      if (!sessionData.session) {
        throw new Error('No session found');
      }

      if (contentType === 'guide') {
        const { data, error } = await supabase
          .from('guides')
          .update({
            title: updatedContent.title,
            description: updatedContent.content,
            category: updatedContent.category,
          })
          .eq('id', updatedContent.id)
          .select();

        if (error) {
          console.error('Guide update error:', error);
          throw error;
        }
        return data;
      } else {
        const { data, error } = await supabase
          .from('educational_content')
          .update({
            title: updatedContent.title,
            content: updatedContent.content,
            category: updatedContent.category,
            published: updatedContent.published,
            has_quiz: updatedContent.has_quiz,
            author_id: sessionData.session.user.id || updatedContent.author_id,
          })
          .eq('id', updatedContent.id)
          .select();

        if (error) {
          console.error('Educational content update error:', error);
          throw error;
        }
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationalContent'] });
      toast({
        title: "Success",
        description: "Content updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Update error details:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newContent: Omit<Content, 'id' | 'author_id' | 'slug'>) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session found');
      }
      
      if (contentType === 'guide') {
        const { data, error } = await supabase
          .from('guides')
          .insert([{
            title: newContent.title,
            description: newContent.content,
            category: newContent.category,
            read_time: '5 min',
            points: 10,
            difficulty: 'beginner',
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('educational_content')
          .insert([{
            title: newContent.title,
            content: newContent.content,
            category: newContent.category,
            published: newContent.published,
            has_quiz: newContent.has_quiz,
            content_type: 'educational',
            author_id: session.user.id,
            slug: `${newContent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationalContent'] });
      toast({
        title: "Success",
        description: "Content created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create content. Please try again.",
        variant: "destructive",
      });
    },
  });

  return { updateMutation, createMutation };
};