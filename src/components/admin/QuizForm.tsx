import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          {existingQuizzes?.map((quiz) => (
            <div key={quiz.id} className="flex items-center space-x-2 p-4 border rounded">
              <input
                type="radio"
                name="quiz_id"
                value={quiz.id}
                checked={selectedQuizId === quiz.id}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                className="h-4 w-4"
              />
              <div>
                <h3 className="font-medium">{quiz.title}</h3>
                <p className="text-sm text-gray-500">{quiz.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!selectedQuizId}>
            Attach Quiz
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Quiz Title</Label>
        <Input
          id="title"
          name="title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
        />
      </div>

      <div>
        <Label htmlFor="category_id">Category</Label>
        <select
          id="category_id"
          name="category_id"
          className="w-full border rounded-md p-2"
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="points">Points</Label>
        <Input
          id="points"
          name="points"
          type="number"
          min="0"
          defaultValue="10"
          required
        />
      </div>

      <div>
        <Label htmlFor="difficulty_level">Difficulty Level</Label>
        <select
          id="difficulty_level"
          name="difficulty_level"
          className="w-full border rounded-md p-2"
          required
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Quiz
        </Button>
      </div>
    </form>
  );
};
