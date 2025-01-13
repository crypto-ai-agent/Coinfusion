import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ContentForm } from "@/components/admin/ContentForm";
import { ContentTable } from "@/components/admin/ContentTable";
import { useToast } from "@/hooks/use-toast";

type Content = {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  slug: string;
  published: boolean;
};

export const EducationalContentManager = () => {
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const createMutation = useMutation({
    mutationFn: async (newContent: Omit<Content, 'id' | 'author_id'>) => {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase
        .from('educational_content')
        .insert([{ ...newContent, author_id: session?.user.id }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationalContent'] });
      toast({
        title: "Success",
        description: "Content created successfully.",
      });
      setIsAddingContent(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedContent: Content) => {
      const { error } = await supabase
        .from('educational_content')
        .update(updatedContent)
        .eq('id', updatedContent.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationalContent'] });
      toast({
        title: "Success",
        description: "Content updated successfully.",
      });
      setEditingContent(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('educational_content')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationalContent'] });
      toast({
        title: "Success",
        description: "Content deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const contentData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      slug: formData.get('slug') as string,
      published: formData.get('published') === 'true',
    };

    if (editingContent) {
      updateMutation.mutate({ ...contentData, id: editingContent.id, author_id: editingContent.author_id });
    } else {
      createMutation.mutate(contentData);
    }
  };

  const handleEdit = (item: Content) => {
    setEditingContent(item);
    setIsAddingContent(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Educational Content</h2>
        {!editingContent && (
          <Button onClick={() => setIsAddingContent(true)}>
            Add New Content
          </Button>
        )}
      </div>

      {(isAddingContent || editingContent) ? (
        <ContentForm 
          onSubmit={handleSubmit}
          onClose={() => {
            setIsAddingContent(false);
            setEditingContent(null);
          }}
          type="education"
          isEditing={!!editingContent}
          defaultValues={editingContent || undefined}
        />
      ) : (
        <ContentTable 
          items={content || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};