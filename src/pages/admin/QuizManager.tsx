import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Added missing import
import { QuizForm } from "@/components/admin/QuizForm";
import { QuizQuestionForm } from "@/components/admin/QuizQuestionForm";
import { QuizQuestionList } from "@/components/admin/quiz/QuizQuestionList";
import { useToast } from "@/hooks/use-toast";
import { QuizList } from "@/components/admin/quiz/QuizList";
import { QuizHeader } from "@/components/admin/quiz/QuizHeader";
import { EditQuizDialog } from "@/components/admin/quiz/EditQuizDialog";
import { Quiz } from "@/types/content";

export const QuizManager = () => {
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
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
          id,
          title,
          description,
          points,
          difficulty_level,
          quiz_categories (
            name
          )
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteQuizMutation = useMutation({
    mutationFn: async (quizId: string) => {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast({
        title: "Success",
        description: "Quiz deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive",
      });
    },
  });

  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', questionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Question deleted successfully",
    });
    queryClient.invalidateQueries({ queryKey: ['quiz-questions', selectedQuiz] });
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz? This will also delete all associated questions.')) {
      deleteQuizMutation.mutate(quizId);
    }
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setIsAddingQuestion(false);
    setEditingQuiz(null);
  };

  const handleEditQuestion = (questionId: string) => {
    toast({
      title: "Coming Soon",
      description: "Question editing will be available in the next update",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <QuizHeader
        title={selectedQuiz ? 'Quiz Questions' : 'Quiz Management'}
        showBackButton={!!selectedQuiz}
        onBack={handleBackToQuizzes}
        onAddNew={!selectedQuiz ? () => setIsAddingQuiz(true) : undefined}
      />

      {isAddingQuiz && categories && (
        <Card>
          <CardContent className="pt-6">
            <QuizForm
              contentId={null}
              onComplete={(id) => {
                setIsAddingQuiz(false);
                setSelectedQuiz(id);
                setIsAddingQuestion(true);
                toast({
                  title: "Success",
                  description: "Quiz created successfully",
                });
              }}
              onCancel={() => setIsAddingQuiz(false)}
              categories={categories}
              mode="create" // Added the required mode prop
            />
          </CardContent>
        </Card>
      )}

      {selectedQuiz && (
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="flex justify-end">
              <Button onClick={() => setIsAddingQuestion(true)}>
                Add Question
              </Button>
            </div>

            {isAddingQuestion && (
              <QuizQuestionForm
                quizId={selectedQuiz}
                onClose={() => setIsAddingQuestion(false)}
                onComplete={() => {
                  setIsAddingQuestion(false);
                  queryClient.invalidateQueries({ queryKey: ['quiz-questions', selectedQuiz] });
                  toast({
                    title: "Success",
                    description: "Question added successfully",
                  });
                }}
              />
            )}

            <QuizQuestionList
              quizId={selectedQuiz}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
            />
          </CardContent>
        </Card>
      )}

      {!selectedQuiz && quizzes && quizzes.length > 0 && (
        <QuizList
          quizzes={quizzes as Quiz[]}
          onSelect={setSelectedQuiz}
          onEdit={setEditingQuiz}
          onDelete={handleDeleteQuiz}
        />
      )}

      <EditQuizDialog
        quiz={editingQuiz}
        isOpen={!!editingQuiz}
        onClose={() => setEditingQuiz(null)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['quizzes'] });
        }}
      />
    </div>
  );
};
