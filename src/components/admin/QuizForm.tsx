import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuizBasicForm } from "./quiz/forms/QuizBasicForm";
import { QuizSelectionForm } from "./quiz/forms/QuizSelectionForm";

export type QuizFormProps = {
  contentId?: string;
  onComplete: (id: string) => void;
  onCancel: () => void;
  categories: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  mode: 'create' | 'select';
};

export const QuizForm = ({ contentId, onComplete, onCancel, categories, mode }: QuizFormProps) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingQuizzes } = useQuery({
    queryKey: ['unattachedQuizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .is('content_id', null);
      if (error) throw error;
      return data;
    },
    enabled: mode === 'select',
  });

  const createQuizMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert([{
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          content_id: contentId,
          quiz_type: 'content_linked',
          points: parseInt(formData.get('points') as string),
          difficulty_level: formData.get('difficulty_level') as string,
          category_id: formData.get('category_id') as string,
        }])
        .select()
        .single();

      if (quizError) throw quizError;
      return quiz;
    },
    onSuccess: (quiz) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast({
        title: "Success",
        description: "Quiz created successfully.",
      });
      onComplete(quiz.id);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  const attachQuizMutation = useMutation({
    mutationFn: async (quizId: string) => {
      const { error } = await supabase
        .from('quizzes')
        .update({ content_id: contentId })
        .eq('id', quizId);
      if (error) throw error;
      return quizId;
    },
    onSuccess: (quizId) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast({
        title: "Success",
        description: "Quiz attached successfully.",
      });
      onComplete(quizId);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to attach quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === 'select' && selectedQuizId) {
      attachQuizMutation.mutate(selectedQuizId);
    } else {
      const formData = new FormData(e.currentTarget);
      createQuizMutation.mutate(formData);
    }
  };

  if (mode === 'select') {
    return (
      <QuizSelectionForm
        existingQuizzes={existingQuizzes || []}
        selectedQuizId={selectedQuizId}
        onQuizSelect={setSelectedQuizId}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    );
  }

  return (
    <QuizBasicForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      categories={categories}
    />
  );
};