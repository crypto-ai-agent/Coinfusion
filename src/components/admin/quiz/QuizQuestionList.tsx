import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizQuestionForm } from "../QuizQuestionForm";
import { QuizQuestionListProps } from "@/types/content";

export const QuizQuestionList = ({ quizId, onEdit, onDelete }: QuizQuestionListProps) => {
  const queryClient = useQueryClient();
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['quiz-questions', quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('created_at');
      
      if (error) throw error;
      return data;
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async (updatedQuestion: any) => {
      const { error } = await supabase
        .from('quiz_questions')
        .update(updatedQuestion)
        .eq('id', updatedQuestion.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-questions', quizId] });
      setEditingQuestion(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update question",
        variant: "destructive",
      });
    },
  });

  const handleEditComplete = (updatedQuestion: any) => {
    updateQuestionMutation.mutate(updatedQuestion);
  };

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="space-y-4">
      {questions?.map((question) => (
        <Card key={question.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {question.question}
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setEditingQuestion(question)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(question.id)}
              >
                Delete
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Options: {Array.isArray(question.options) ? question.options.join(', ') : JSON.stringify(question.options)}
              </p>
              <p className="text-sm text-muted-foreground">
                Correct Answer: {question.correct_answer}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      {editingQuestion && (
        <Dialog open={!!editingQuestion} onOpenChange={() => setEditingQuestion(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
            </DialogHeader>
            <QuizQuestionForm
              quizId={quizId}
              onClose={() => setEditingQuestion(null)}
              onComplete={handleEditComplete}
              defaultValues={editingQuestion}
              isEditing={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
