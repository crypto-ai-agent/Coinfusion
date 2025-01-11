import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { ContentForm } from "@/components/admin/ContentForm";
import { ContentTable } from "@/components/admin/ContentTable";

type EducationalContent = {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  slug: string;
  published: boolean;
};

export const EducationalContentManager = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState<EducationalContent | null>(null);

  const { data: content, refetch } = useQuery({
    queryKey: ['educational-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('educational_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EducationalContent[];
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
      const contentData = {
        title: String(formData.get('title')),
        content: String(formData.get('content')),
        category: String(formData.get('category')),
        slug: String(formData.get('slug')),
        published: formData.get('published') === 'true',
        author_id: user.id,
      };

      if (editingContent) {
        const { error } = await supabase
          .from('educational_content')
          .update(contentData)
          .eq('id', editingContent.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Content updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('educational_content')
          .insert([contentData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Content created successfully",
        });
      }

      form.reset();
      setIsEditing(false);
      setEditingContent(null);
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
        .from('educational_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Content deleted successfully",
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
          setEditingContent(null);
        }}
        className="mb-4"
      >
        <Plus className="mr-2 h-4 w-4" />
        {isEditing ? "Cancel" : "Add New Content"}
      </Button>

      {isEditing && (
        <ContentForm
          onSubmit={handleSubmit}
          defaultValues={editingContent}
          isEditing={!!editingContent}
        />
      )}

      <ContentTable
        items={content || []}
        onEdit={(content) => {
          setIsEditing(true);
          setEditingContent(content);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};