import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ContentForm } from "@/components/admin/ContentForm";
import { ContentTable } from "@/components/admin/ContentTable";

export const EducationalContentManager = () => {
  const [isAddingContent, setIsAddingContent] = useState(false);

  const { data: content, isLoading } = useQuery({
    queryKey: ['educationalContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('educational_content')
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
        <h2 className="text-xl font-semibold">Educational Content</h2>
        <Button onClick={() => setIsAddingContent(true)}>
          Add New Content
        </Button>
      </div>

      {isAddingContent ? (
        <ContentForm onClose={() => setIsAddingContent(false)} />
      ) : (
        <ContentTable content={content || []} />
      )}
    </div>
  );
};