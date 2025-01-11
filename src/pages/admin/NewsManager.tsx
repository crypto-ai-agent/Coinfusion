import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { ContentForm } from "@/components/admin/ContentForm";
import { ContentTable } from "@/components/admin/ContentTable";

type NewsArticle = {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  slug: string;
  published: boolean;
};

export const NewsManager = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  const { data: articles, refetch } = useQuery({
    queryKey: ['news-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as NewsArticle[];
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const articleData = {
        title: String(formData.get('title')),
        content: String(formData.get('content')),
        category: String(formData.get('category')),
        slug: String(formData.get('slug')),
        published: formData.get('published') === 'true',
        author_id: user.id,
      };

      if (editingArticle) {
        const { error } = await supabase
          .from('news_articles')
          .update(articleData)
          .eq('id', editingArticle.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Article updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('news_articles')
          .insert([articleData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Article created successfully",
        });
      }

      form.reset();
      setIsEditing(false);
      setEditingArticle(null);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Button 
        onClick={() => {
          setIsEditing(!isEditing);
          setEditingArticle(null);
        }}
        className="mb-4"
      >
        <Plus className="mr-2 h-4 w-4" />
        {isEditing ? "Cancel" : "Add New Article"}
      </Button>

      {isEditing && (
        <ContentForm
          onSubmit={handleSubmit}
          defaultValues={editingArticle}
          isEditing={!!editingArticle}
        />
      )}

      <ContentTable
        items={articles || []}
        onEdit={(article) => {
          setIsEditing(true);
          setEditingArticle(article);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};