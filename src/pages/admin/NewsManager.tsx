import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsForm } from "@/components/admin/news/NewsForm";
import { NewsTable } from "@/components/admin/news/NewsTable";
import { NewsHeader } from "@/components/admin/news/NewsHeader";
import { useNewsActions } from "@/components/admin/news/NewsActions";
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
  slug: string;
}

export const NewsManager = () => {
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [editingContent, setEditingContent] = useState<NewsArticle | null>(null);
  const { toast } = useToast();
  const { createArticle, updateArticle, deleteArticle } = useNewsActions();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (formData: {
    title: string;
    content: string;
    category: string;
    published: boolean;
  }) => {
    try {
      const newsData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        published: formData.published,
        content_type: 'news' as const,
        author_id: (await supabase.auth.getUser()).data.user?.id,
      };

      if (editingContent) {
        await updateArticle({ ...newsData, id: editingContent.id });
        setEditingContent(null);
      } else {
        await createArticle(newsData);
        setIsAddingContent(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save article",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <NewsHeader 
        onAdd={() => setIsAddingContent(true)}
        isEditing={!!editingContent}
      />

      {(isAddingContent || editingContent) ? (
        <NewsForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsAddingContent(false);
            setEditingContent(null);
          }}
          defaultValues={editingContent || undefined}
        />
      ) : (
        <NewsTable
          articles={articles || []}
          onEdit={setEditingContent}
          onDelete={async (id) => {
            if (window.confirm('Are you sure you want to delete this article?')) {
              await deleteArticle(id);
            }
          }}
        />
      )}
    </div>
  );
};