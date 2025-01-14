import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type QuizQuestionFormProps = {
  quizId: string;
  onClose: () => void;
  onComplete: () => void;
  defaultValues?: {
    question?: string;
    options?: string[];
    correct_answer?: string;
    explanation?: string;
    feedback_correct?: string;
    feedback_incorrect?: string;
  };
  isEditing?: boolean;
};

export const QuizQuestionForm = ({
  quizId,
  onClose,
  onComplete,
  defaultValues,
  isEditing = false,
}: QuizQuestionFormProps) => {
  const [options, setOptions] = useState<string[]>(defaultValues?.options || ['', '', '', '']);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const questionData = {
        quiz_id: quizId,
        question: formData.get('question')?.toString() || '',
        options: options.filter(opt => opt.trim() !== ''),
        correct_answer: formData.get('correct_answer')?.toString() || '',
        explanation: formData.get('explanation')?.toString() || '',
        feedback_correct: formData.get('feedback_correct')?.toString() || '',
        feedback_incorrect: formData.get('feedback_incorrect')?.toString() || '',
      };

      const { error } = await supabase
        .from('quiz_questions')
        .insert([questionData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-questions', quizId] });
      toast({
        title: "Success",
        description: "Question added successfully",
      });
      onComplete();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add question",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createQuestionMutation.mutate(formData);
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question</label>
        <Textarea
          id="question"
          name="question"
          required
          placeholder="Enter your question"
          defaultValue={defaultValues?.question}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Answer Options</label>
        {options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              name={`option_${index}`}
              placeholder={`Option ${index + 1}`}
              required
            />
            {options.length > 2 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleRemoveOption(index)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {options.length < 6 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddOption}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        )}
      </div>

      <div>
        <label htmlFor="correct_answer" className="block text-sm font-medium text-gray-700">Correct Answer</label>
        <select
          id="correct_answer"
          name="correct_answer"
          className="w-full border rounded-md p-2"
          required
          defaultValue={defaultValues?.correct_answer}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option || `Option ${index + 1}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">Explanation</label>
        <Textarea
          id="explanation"
          name="explanation"
          placeholder="Explain why this is the correct answer"
          defaultValue={defaultValues?.explanation}
        />
      </div>

      <div>
        <label htmlFor="feedback_correct" className="block text-sm font-medium text-gray-700">Feedback for Correct Answer</label>
        <Textarea
          id="feedback_correct"
          name="feedback_correct"
          placeholder="Feedback when user answers correctly"
          defaultValue={defaultValues?.feedback_correct}
        />
      </div>

      <div>
        <label htmlFor="feedback_incorrect" className="block text-sm font-medium text-gray-700">Feedback for Incorrect Answer</label>
        <Textarea
          id="feedback_incorrect"
          name="feedback_incorrect"
          placeholder="Feedback when user answers incorrectly"
          defaultValue={defaultValues?.feedback_incorrect}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? "Update" : "Add"} Question
        </Button>
      </div>
    </form>
  );
};