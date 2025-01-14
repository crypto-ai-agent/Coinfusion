import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ContentForm } from "@/components/admin/ContentForm";
import { ContentTable } from "@/components/admin/ContentTable";
import { useToast } from "@/hooks/use-toast";

type News = {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  slug: string;
  published: boolean;
  content_type: 'guide' | 'educational';
  created_at?: string;
  updated_at?: string;
};

export const NewsManager = () => {
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: news, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        content_type: 'educational' as const
      }));
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newNews: Omit<News, 'id' | 'author_id'>) => {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase
        .from('news_articles')
        .insert([{ ...newNews, author_id: session?.user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast({
        title: "Success",
        description: "News article created successfully.",
      });
      setIsAddingNews(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create news article. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedNews: News) => {
      const { error } = await supabase
        .from('news_articles')
        .update({ ...updatedNews, content_type: 'educational' })
        .eq('id', updatedNews.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast({
        title: "Success",
        description: "News article updated successfully.",
      });
      setEditingNews(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update news article. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast({
        title: "Success",
        description: "News article deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete news article. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newsData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      slug: formData.get('slug') as string,
      published: formData.get('published') === 'true',
      content_type: 'educational' as const,
    };

    if (editingNews) {
      updateMutation.mutate({ ...newsData, id: editingNews.id, author_id: editingNews.author_id });
    } else {
      createMutation.mutate(newsData);
    }
  };

  const handleEdit = (item: News) => {
    setEditingNews(item);
    setIsAddingNews(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">News Management</h2>
        {!editingNews && (
          <Button onClick={() => setIsAddingNews(true)}>
            Add News Article
          </Button>
        )}
      </div>

      {(isAddingNews || editingNews) ? (
        <ContentForm 
          onSubmit={handleSubmit}
          onClose={() => {
            setIsAddingNews(false);
            setEditingNews(null);
          }}
          type="educational"
          isEditing={!!editingNews}
          defaultValues={editingNews || undefined}
        />
      ) : (
        <ContentTable 
          items={news || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};