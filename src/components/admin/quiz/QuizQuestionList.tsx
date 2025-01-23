import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuizQuestionForm } from "../QuizQuestionForm";

interface QuizQuestionListProps {
  quizId: string;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
}

export const QuizQuestionList = ({ quizId, onEdit, onDelete }: QuizQuestionListProps) => {
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const { toast } = useToast();

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

  const handleEditComplete = () => {
    setEditingQuestion(null);
    onEdit(editingQuestion.id);
  };

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="space-y-4">
      {questions?.map((question) => (
        <Card key={question.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-medium">{question.question}</h3>
                <p className="text-sm text-muted-foreground">
                  Options: {Array.isArray(question.options) 
                    ? question.options.join(', ') 
                    : JSON.stringify(question.options)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Correct Answer: {question.correct_answer}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingQuestion(question)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(question.id)}
                >
                  Delete
                </Button>
              </div>
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