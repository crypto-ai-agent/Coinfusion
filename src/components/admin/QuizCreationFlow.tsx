import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuizForm } from "./QuizForm";
import { QuizQuestionForm } from "./QuizQuestionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuizCreationFlowProps {
  contentId: string;
  onComplete: () => void;
  onCancel: () => void;
}

export const QuizCreationFlow = ({ contentId, onComplete, onCancel }: QuizCreationFlowProps) => {
  const [step, setStep] = useState<'quiz' | 'questions'>('quiz');
  const [quizId, setQuizId] = useState<string | null>(null);

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
        </DialogHeader>

        {step === 'quiz' ? (
          <QuizForm
            contentId={contentId}
            onComplete={handleQuizCreated}
            onCancel={onCancel}
          />
        ) : (
          <div className="space-y-4">
            <QuizQuestionForm
              quizId={quizId!}
              onSubmit={() => {}}
              onClose={() => {}}
            />
            <div className="flex justify-end space-x-2">
              <Button onClick={onComplete}>Finish</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};