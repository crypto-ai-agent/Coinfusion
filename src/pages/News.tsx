import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { News as NewsSection } from "@/components/News";
import { Loader2 } from "lucide-react";

const NewsPage = () => {
  const { data: newsArticles, isLoading } = useQuery({
    queryKey: ['published-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20">
        <NewsSection articles={newsArticles || []} />
      </div>
    </div>
  );
};

export default NewsPage;