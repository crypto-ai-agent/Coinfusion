import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuizForm } from "./QuizForm";
import { QuizQuestionForm } from "./QuizQuestionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface QuizCreationFlowProps {
  contentId: string;
  onComplete: (id: string) => void;
  onCancel: () => void;
}

export const QuizCreationFlow = ({ contentId, onComplete, onCancel }: QuizCreationFlowProps) => {
  const [step, setStep] = useState<'quiz' | 'questions'>('quiz');
  const [quizId, setQuizId] = useState<string | null>(null);

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

  const handleQuizCreated = (id: string) => {
    setQuizId(id);
    setStep('questions');
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'quiz' ? 'Create Quiz' : 'Add Questions'}
          </DialogTitle>
          <DialogDescription>
            {step === 'quiz' 
              ? 'First, set up the basic quiz information'
              : 'Now, add questions to your quiz'}
          </DialogDescription>
        </DialogHeader>

        {step === 'quiz' ? (
          <QuizForm
            contentId={contentId}
            onComplete={handleQuizCreated}
            onCancel={onCancel}
            categories={categories || []}
          />
        ) : (
          <div className="space-y-4">
            <QuizQuestionForm
              quizId={quizId || ''}
              onSubmit={() => {}}
              onClose={() => {}}
            />
            <div className="flex justify-end space-x-2">
              <Button onClick={() => onComplete(quizId || '')}>Finish</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};