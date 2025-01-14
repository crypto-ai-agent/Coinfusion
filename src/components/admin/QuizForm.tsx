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
  onComplete: () => void;
  onCancel: () => void;
};

export const QuizForm = ({ contentId, onComplete, onCancel }: QuizFormProps) => {
  const [questions, setQuestions] = useState([{ question: '', options: ['', ''], correctAnswer: '' }]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createQuizMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // First create the quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert([{
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          content_id: contentId,
          quiz_type: 'content_linked',
          points: parseInt(formData.get('points') as string),
          difficulty_level: formData.get('difficulty_level') as string,
        }])
        .select()
        .single();

      if (quizError) throw quizError;

      // Then create all questions
      const questionsData = questions.map(q => ({
        quiz_id: quiz.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correctAnswer,
      }));

      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(questionsData);

      if (questionsError) throw questionsError;

      return quiz;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast({
        title: "Success",
        description: "Quiz created successfully.",
      });
      onComplete();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createQuizMutation.mutate(formData);
  };

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