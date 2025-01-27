import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface NewsActionsHookResult {
  createArticle: (data: any) => Promise<void>;
  updateArticle: (data: any) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
}

export const useNewsActions = (): NewsActionsHookResult => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createArticle = async (newsData: any) => {
    const { error } = await supabase
      .from('news_articles')
      .insert([newsData]);

    if (error) throw error;
    
    queryClient.invalidateQueries({ queryKey: ['news'] });
    toast({
      title: "Success",
      description: "Article created successfully",
    });
  };

  const updateArticle = async (newsData: any) => {
    const { error } = await supabase
      .from('news_articles')
      .update(newsData)
      .eq('id', newsData.id);

    if (error) throw error;
    
    queryClient.invalidateQueries({ queryKey: ['news'] });
    toast({
      title: "Success",
      description: "Article updated successfully",
    });
  };

  const deleteArticle = async (id: string) => {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    queryClient.invalidateQueries({ queryKey: ['news'] });
    toast({
      title: "Success",
      description: "Article deleted successfully",
    });
  };

  return {
    createArticle,
    updateArticle,
    deleteArticle
  };
};