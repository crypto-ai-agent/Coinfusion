import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { QuizForm } from "@/components/admin/QuizForm";
import { QuizQuestionForm } from "@/components/admin/quiz/QuizQuestionForm";
import { QuizQuestionList } from "@/components/admin/quiz/QuizQuestionList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Pencil } from "lucide-react";

export const QuizManager = () => {
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<string | null>(null);
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
    // This will be implemented in the next iteration
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {selectedQuiz && (
            <Button 
              variant="ghost" 
              onClick={handleBackToQuizzes}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quizzes
            </Button>
          )}
          <h2 className="text-xl font-semibold">
            {selectedQuiz ? 'Quiz Questions' : 'Quiz Management'}
          </h2>
        </div>
        {!selectedQuiz && (
          <Button onClick={() => setIsAddingQuiz(true)}>
            Create New Quiz
          </Button>
        )}
      </div>

      {isAddingQuiz && categories && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Quiz</CardTitle>
          </CardHeader>
          <CardContent>
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
            />
          </CardContent>
        </Card>
      )}

      {selectedQuiz && (
        <Card>
          <CardHeader>
            <CardTitle>
              {quizzes?.find(q => q.id === selectedQuiz)?.title}
            </CardTitle>
            <CardDescription>
              Manage questions for this quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setIsAddingQuestion(true)}>
                Add Question
              </Button>
            </div>

            {isAddingQuestion && (
              <QuizQuestionForm
                quizId={selectedQuiz}
                onClose={() => setIsAddingQuestion(false)}
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
        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingQuiz(quiz.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Category: {quiz.quiz_categories?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Difficulty: {quiz.difficulty_level}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Points: {quiz.points}
                    </p>
                  </div>
                  <Button onClick={() => setSelectedQuiz(quiz.id)}>
                    Manage Questions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};