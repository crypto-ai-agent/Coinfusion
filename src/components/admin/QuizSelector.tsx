import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface QuizSelectorProps {
  onSelect: (quizId: string | null) => void;
  currentQuizId?: string | null;
}

export const QuizSelector = ({ onSelect, currentQuizId }: QuizSelectorProps) => {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(currentQuizId || null);

  const { data: quizzes } = useQuery({
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
        .is('content_id', null); // Only get unattached quizzes
      
      if (error) throw error;
      return data;
    },
  });

  const handleConfirm = () => {
    onSelect(selectedQuiz);
  };

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedQuiz || ''} onValueChange={(value) => setSelectedQuiz(value)}>
        <div className="grid gap-4">
          {quizzes?.map((quiz) => (
            <Card key={quiz.id} className="p-4">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value={quiz.id} id={quiz.id} />
                <div className="flex-1">
                  <Label htmlFor={quiz.id} className="text-base font-medium">
                    {quiz.title}
                  </Label>
                  <p className="text-sm text-gray-500">{quiz.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{quiz.points} points</span>
                    <span>{quiz.difficulty_level}</span>
                    {quiz.quiz_categories?.name && (
                      <span>{quiz.quiz_categories.name}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </RadioGroup>
      <div className="flex justify-end space-x-2">
        <Button onClick={() => onSelect(null)} variant="outline">
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={!selectedQuiz}>
          Attach Quiz
        </Button>
      </div>
    </div>
  );
};