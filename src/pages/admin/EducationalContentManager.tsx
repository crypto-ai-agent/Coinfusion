import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ContentForm } from "@/components/admin/ContentForm";
import { ContentTable } from "@/components/admin/ContentTable";
import { QuizCreationFlow } from "@/components/admin/QuizCreationFlow";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Content = {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  slug: string;
  published: boolean;
  content_type: 'guide' | 'educational';
  has_quiz?: boolean;
  created_at?: string;
  updated_at?: string;
};

export const EducationalContentManager = () => {
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<'guide' | 'educational'>('guide');
  const [quizContent, setQuizContent] = useState<Content | null>(null);
  const [isCreatingNewQuiz, setIsCreatingNewQuiz] = useState(false);
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
      return data as Content[];
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const createMutation = useMutation({
    mutationFn: async (newContent: Omit<Content, 'id' | 'author_id' | 'slug'>) => {
      const { data: { session } } = await supabase.auth.getSession();
      const slug = generateSlug(newContent.title);
      
      const { data, error } = await supabase
        .from('educational_content')
        .insert([{ 
          ...newContent, 
          author_id: session?.user.id,
          slug
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Content;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['educationalContent'] });
      toast({
        title: "Success",
        description: "Content created successfully.",
      });
      setIsAddingContent(false);

      if (data.content_type === 'educational' && data.has_quiz) {
        setQuizContent(data as Content);
        setIsCreatingNewQuiz(true);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
      console.error('Creation error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedContent: Content) => {
      const { error } = await supabase
        .from('educational_content')
        .update({
          ...updatedContent,
          slug: generateSlug(updatedContent.title)
        })
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
      published: formData.get('published') === 'true',
      content_type: selectedContentType,
      has_quiz: selectedContentType === 'educational' && formData.get('has_quiz') === 'true',
    };

    if (editingContent) {
      updateMutation.mutate({ ...contentData, id: editingContent.id, author_id: editingContent.author_id, slug: editingContent.slug });
    } else {
      createMutation.mutate(contentData);
    }
  };

  const handleAddQuiz = (content: Content) => {
    setQuizContent(content);
    setIsCreatingNewQuiz(false);
  };

  const handleCreateNewQuiz = (content: Content) => {
    setQuizContent(content);
    setIsCreatingNewQuiz(true);
  };

  const handleQuizComplete = async () => {
    if (quizContent) {
      const { error } = await supabase
        .from('educational_content')
        .update({ has_quiz: true })
        .eq('id', quizContent.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update content. Please try again.",
          variant: "destructive",
        });
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['educationalContent'] });
      setQuizContent(null);
      setIsCreatingNewQuiz(false);
      toast({
        title: "Success",
        description: "Quiz added successfully.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleEdit = (item: Content) => {
    setEditingContent(item);
    setSelectedContentType(item.content_type);
    setIsAddingContent(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredContent = content?.filter(item => 
    item.content_type === selectedContentType
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="guides" className="w-full">
        <TabsList>
          <TabsTrigger 
            value="guides" 
            onClick={() => setSelectedContentType('guide')}
          >
            Guides
          </TabsTrigger>
          <TabsTrigger 
            value="educational" 
            onClick={() => setSelectedContentType('educational')}
          >
            Educational Materials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guides">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Guides</h2>
            {!editingContent && (
              <Button onClick={() => setIsAddingContent(true)}>
                Add New Guide
              </Button>
            )}
          </div>

          {(isAddingContent || editingContent) && selectedContentType === 'guide' ? (
            <ContentForm 
              onSubmit={handleSubmit}
              onClose={() => {
                setIsAddingContent(false);
                setEditingContent(null);
              }}
              type="guide"
              isEditing={!!editingContent}
              defaultValues={editingContent || undefined}
            />
          ) : (
            <ContentTable 
              items={content?.filter(item => item.content_type === 'guide') || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </TabsContent>

        <TabsContent value="educational">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Educational Materials</h2>
            {!editingContent && (
              <Button onClick={() => setIsAddingContent(true)}>
                Add New Educational Material
              </Button>
            )}
          </div>

          {(isAddingContent || editingContent) && selectedContentType === 'educational' ? (
            <ContentForm 
              onSubmit={handleSubmit}
              onClose={() => {
                setIsAddingContent(false);
                setEditingContent(null);
              }}
              type="educational"
              isEditing={!!editingContent}
              defaultValues={editingContent || undefined}
              showQuizOption
            />
          ) : (
            <ContentTable 
              items={content?.filter(item => item.content_type === 'educational') || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddQuiz={handleAddQuiz}
              onCreateNewQuiz={handleCreateNewQuiz}
            />
          )}
        </TabsContent>
      </Tabs>

      {quizContent && (
        <QuizCreationFlow
          contentId={quizContent.id}
          onComplete={handleQuizComplete}
          onCancel={() => {
            setQuizContent(null);
            setIsCreatingNewQuiz(false);
          }}
          isCreatingNew={isCreatingNewQuiz}
        />
      )}
    </div>
  );
};
