import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContentForm } from "@/components/admin/ContentForm";
import { ContentTable } from "@/components/admin/ContentTable";
import { QuizCreationFlow } from "@/components/admin/QuizCreationFlow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Content } from "@/types/content";
import { ContentHeader } from "@/components/admin/content/ContentHeader";
import { useContentMutations } from "@/components/admin/content/ContentMutations";
import { useToast } from "@/hooks/use-toast";

export const EducationalContentManager = () => {
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<'guide' | 'educational'>('guide');
  const [quizContent, setQuizContent] = useState<Content | null>(null);
  const [isCreatingNewQuiz, setIsCreatingNewQuiz] = useState(false);
  const { toast } = useToast();

  const { data: content, isLoading } = useQuery({
    queryKey: ['educationalContent', selectedContentType],
    queryFn: async () => {
      if (selectedContentType === 'guide') {
        const { data, error } = await supabase
          .from('guides')
          .select('*, quizzes(title)')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data.map((item: any) => ({
          ...item,
          content: item.description,
          quiz_title: item.quizzes?.[0]?.title,
          content_type: 'guide' as const,
          has_quiz: !!item.quizzes?.[0],
          published: true
        }));
      } else {
        const { data, error } = await supabase
          .from('educational_content')
          .select('*, quizzes(title)')
          .eq('content_type', 'educational')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data.map((item: any) => ({
          ...item,
          quiz_title: item.quizzes?.[0]?.title
        }));
      }
    },
  });

  const { updateMutation, createMutation } = useContentMutations(selectedContentType);

  const handleSubmit = async (formData: any) => {
    console.log('Form submission data:', formData);
    
    if (editingContent) {
      updateMutation.mutate({ 
        ...editingContent,
        ...formData,
      });
      setEditingContent(null);
    } else {
      createMutation.mutate(formData);
      setIsAddingContent(false);
    }
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
          <ContentHeader
            title="Guides"
            onAdd={() => setIsAddingContent(true)}
            isEditing={!!editingContent}
          />

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
              items={content || []}
              onEdit={(item) => {
                setEditingContent(item);
                setSelectedContentType(item.content_type);
                setIsAddingContent(false);
              }}
              onDelete={async (id) => {
                const { error } = await supabase
                  .from(selectedContentType === 'guide' ? 'guides' : 'educational_content')
                  .delete()
                  .eq('id', id);
                
                if (error) {
                  toast({
                    title: "Error",
                    description: "Failed to delete content.",
                    variant: "destructive",
                  });
                  return;
                }
                
                toast({
                  title: "Success",
                  description: "Content deleted successfully.",
                });
              }}
              onAddQuiz={(content) => {
                setQuizContent(content);
                setIsCreatingNewQuiz(false);
              }}
              onCreateNewQuiz={(content) => {
                setQuizContent(content);
                setIsCreatingNewQuiz(true);
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="educational">
          <ContentHeader
            title="Educational Materials"
            onAdd={() => setIsAddingContent(true)}
            isEditing={!!editingContent}
          />

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
              onEdit={(item) => {
                console.log('Editing item:', item);
                setEditingContent(item);
                setSelectedContentType(item.content_type);
                setIsAddingContent(false);
              }}
              onDelete={async (id) => {
                const { error } = await supabase
                  .from('educational_content')
                  .delete()
                  .eq('id', id);
                
                if (error) {
                  toast({
                    title: "Error",
                    description: "Failed to delete content.",
                    variant: "destructive",
                  });
                  return;
                }
                
                toast({
                  title: "Success",
                  description: "Content deleted successfully.",
                });
              }}
              onAddQuiz={(content) => {
                setQuizContent(content);
                setIsCreatingNewQuiz(false);
              }}
              onCreateNewQuiz={(content) => {
                setQuizContent(content);
                setIsCreatingNewQuiz(true);
              }}
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
