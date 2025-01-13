import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { QuizForm } from "@/components/admin/QuizForm";
import { QuizQuestionForm } from "@/components/admin/QuizQuestionForm";
import { ContentTable } from "@/components/admin/ContentTable";

type Quiz = {
  id: string;
  title: string;
  description: string;
  category_id: string;
  points: number;
  difficulty_level: string;
  estimated_duration: string;
  published?: boolean;
  category?: string;
  author_id?: string;
  slug?: string;
  quiz_categories: {
    name: string;
  };
};

export const QuizManager = () => {
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['quizCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          quiz_categories (
            name
          )
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Quiz[];
    },
  });

  const createQuizMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const quizData = {
        title: String(formData.get('title')),
        description: String(formData.get('description')),
        difficulty_level: String(formData.get('difficulty_level')),
        category_id: String(formData.get('category_id')),
        estimated_duration: `00:${formData.get('estimated_duration')}:00`,
        points: Number(formData.get('points')),
      };

      const { data, error } = await supabase
        .from('quizzes')
        .insert([quizData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast({
        title: "Success",
        description: "Quiz created successfully.",
      });
      setIsAddingQuiz(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const options = Array.from(formData.entries())
        .filter(([key]) => key.startsWith('option_'))
        .map(([, value]) => String(value));

      const questionData = {
        quiz_id: selectedQuiz?.id,
        question: String(formData.get('question')),
        options,
        correct_answer: String(formData.get('correct_answer')),
        explanation: String(formData.get('explanation')),
        feedback_correct: String(formData.get('feedback_correct')),
        feedback_incorrect: String(formData.get('feedback_incorrect')),
      };

      const { error } = await supabase
        .from('quiz_questions')
        .insert([questionData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast({
        title: "Success",
        description: "Question added successfully.",
      });
      setIsAddingQuestion(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleQuizSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createQuizMutation.mutate(formData);
  };

  const handleQuestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createQuestionMutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Quiz Management</h2>
        <div className="space-x-2">
          <Button onClick={() => setIsAddingQuiz(true)}>
            Add New Quiz
          </Button>
          {selectedQuiz && (
            <Button onClick={() => setIsAddingQuestion(true)}>
              Add Question
            </Button>
          )}
        </div>
      </div>

      {isAddingQuiz && (
        <QuizForm
          onSubmit={handleQuizSubmit}
          onClose={() => setIsAddingQuiz(false)}
          categories={categories || []}
        />
      )}

      {isAddingQuestion && (
        <QuizQuestionForm
          onSubmit={handleQuestionSubmit}
          onClose={() => setIsAddingQuestion(false)}
        />
      )}

      {quizzes && quizzes.length > 0 ? (
        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{quiz.title}</h3>
                  <p className="text-sm text-gray-600">{quiz.description}</p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedQuiz(quiz)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(quiz.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No quizzes found. Create one to get started!</p>
      )}
    </div>
  );
};
