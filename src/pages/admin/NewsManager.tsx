import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ContentForm } from "@/components/admin/ContentForm";
import { ContentTable } from "@/components/admin/ContentTable";

export const NewsManager = () => {
  const [isAddingNews, setIsAddingNews] = useState(false);

  const { data: news, isLoading } = useQuery({
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
        <ContentForm onClose={() => setIsAddingNews(false)} type="news" />
      ) : (
        <ContentTable content={news || []} type="news" />
      )}
    </div>
  );
};