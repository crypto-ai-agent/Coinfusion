import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ContentForm } from "@/components/admin/ContentForm";
import { ContentTable } from "@/components/admin/ContentTable";
import { useToast } from "@/hooks/use-toast";

export const NewsManager = () => {
  const [isAddingNews, setIsAddingNews] = useState(false);
  const { toast } = useToast();

  const { data: news, isLoading, refetch } = useQuery({
    queryKey: ['newsArticles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { data: { session } } = await supabase.auth.getSession();

    const newArticle = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      slug: formData.get('slug') as string,
      published: formData.get('published') === 'true',
      author_id: session?.user.id,
    };

    const { error } = await supabase
      .from('news_articles')
      .insert([newArticle]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Article created successfully.",
    });
    setIsAddingNews(false);
    refetch();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">News Articles</h2>
        <Button onClick={() => setIsAddingNews(true)}>
          Add New Article
        </Button>
      </div>

      {isAddingNews ? (
        <ContentForm 
          onSubmit={handleSubmit}
          onClose={() => setIsAddingNews(false)}
          type="news"
          isEditing={false}
        />
      ) : (
        <ContentTable 
          items={news || []}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  );
};