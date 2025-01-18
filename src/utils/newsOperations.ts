import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  slug: string;
  published: boolean;
  content_type: 'news';
  created_at: string;
  updated_at: string;
}

export const updateNewsArticle = async (
  id: string,
  data: Partial<NewsArticle>
): Promise<boolean> => {
  const { error } = await supabase
    .from('news_articles')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error('Error updating news article:', error);
    toast({
      title: "Error",
      description: "Failed to update news article",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

export const createNewsArticle = async (
  data: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>
): Promise<NewsArticle | null> => {
  const { data: newArticle, error } = await supabase
    .from('news_articles')
    .insert([{
      ...data,
      content_type: 'news'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating news article:', error);
    toast({
      title: "Error",
      description: "Failed to create news article",
      variant: "destructive",
    });
    return null;
  }

  return newArticle as NewsArticle;
};

export const deleteNewsArticle = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('news_articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting news article:', error);
    toast({
      title: "Error",
      description: "Failed to delete news article",
      variant: "destructive",
    });
    return false;
  }

  return true;
};