import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ContentForm } from "@/components/admin/ContentForm";
import { ContentTable } from "@/components/admin/ContentTable";
import { useToast } from "@/hooks/use-toast";

export const EducationalContentManager = () => {
  const [isAddingContent, setIsAddingContent] = useState(false);
  const { toast } = useToast();

  const { data: content, isLoading, refetch } = useQuery({
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { data: { session } } = await supabase.auth.getSession();

    const newContent = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      slug: formData.get('slug') as string,
      published: formData.get('published') === 'true',
      author_id: session?.user.id,
    };

    const { error } = await supabase
      .from('educational_content')
      .insert([newContent]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Content created successfully.",
    });
    setIsAddingContent(false);
    refetch();
  };

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
        <ContentForm 
          onSubmit={handleSubmit}
          onClose={() => setIsAddingContent(false)}
          type="education"
          isEditing={false}
        />
      ) : (
        <ContentTable 
          items={content || []}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  );
};