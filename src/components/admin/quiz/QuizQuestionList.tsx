import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MoveUp, MoveDown } from "lucide-react";

interface QuizQuestionListProps {
  quizId: string;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
}

export const QuizQuestionList = ({ quizId, onEdit, onDelete }: QuizQuestionListProps) => {
  const { data: questions, isLoading, refetch } = useQuery({
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

  const handleMoveQuestion = async (questionId: string, direction: 'up' | 'down') => {
    if (!questions) return;
    
    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === questions.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetQuestion = questions[newIndex];
    
    const { error } = await supabase
      .from('quiz_questions')
      .update({ created_at: targetQuestion.created_at })
      .eq('id', questionId);

    if (!error) {
      await supabase
        .from('quiz_questions')
        .update({ created_at: questions[currentIndex].created_at })
        .eq('id', targetQuestion.id);
      
      refetch();
    }
  };

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="space-y-4">
      {questions?.map((question, index) => (
        <Card key={question.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {question.question}
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleMoveQuestion(question.id, 'up')}
                disabled={index === 0}
              >
                <MoveUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleMoveQuestion(question.id, 'down')}
                disabled={index === (questions?.length || 0) - 1}
              >
                <MoveDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(question.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(question.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Options: {(question.options as string[]).join(', ')}
              </p>
              <p className="text-sm text-muted-foreground">
                Correct Answer: {question.correct_answer}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}