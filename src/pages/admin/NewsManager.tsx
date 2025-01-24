import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { NewsTable } from "@/components/admin/news/NewsTable";
import { NewsForm } from "@/components/admin/news/NewsForm";
import { createNewsArticle, deleteNewsArticle, updateNewsArticle, type NewsArticle } from "@/utils/newsOperations";

export const NewsManager = () => {
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: news, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch news articles.",
          variant: "destructive",
        });
        throw error;
      }
      
      return data as NewsArticle[];
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newsData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      slug: formData.get('slug') as string || formData.get('title') as string,
      published: formData.get('published') === 'true',
      content_type: 'news' as const,
      author_id: (await supabase.auth.getUser()).data.user?.id as string,
    };

    if (editingNews) {
      const success = await updateNewsArticle(editingNews.id, newsData);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['news'] });
        toast({
          title: "Success",
          description: "News article updated successfully.",
        });
        setEditingNews(null);
      }
    } else {
      const newArticle = await createNewsArticle(newsData);
      if (newArticle) {
        queryClient.invalidateQueries({ queryKey: ['news'] });
        toast({
          title: "Success",
          description: "News article created successfully.",
        });
        setIsAddingNews(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      const success = await deleteNewsArticle(id);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['news'] });
        toast({
          title: "Success",
          description: "News article deleted successfully.",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">News Management</h2>
        {!editingNews && (
          <Button onClick={() => setIsAddingNews(true)}>
            Add News Article
          </Button>
        )}
      </div>

      {(isAddingNews || editingNews) ? (
        <NewsForm 
          onSubmit={handleSubmit}
          onClose={() => {
            setIsAddingNews(false);
            setEditingNews(null);
          }}
          isEditing={!!editingNews}
          defaultValues={editingNews || undefined}
        />
      ) : (
        <NewsTable 
          news={news || []}
          onEdit={(item) => {
            setEditingNews(item);
            setIsAddingNews(false);
          }}
          onDelete={handleDelete}
          onUpdate={() => queryClient.invalidateQueries({ queryKey: ['news'] })}
        />
      )}
    </div>
  );
};
