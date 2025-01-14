import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type QuizQuestionFormProps = {
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
      const { error } = await supabase
        .from('quiz_questions')
        .insert([{
          quiz_id: quizId,
          question: formData.get('question'),
          options: options,
          correct_answer: formData.get('correct_answer'),
          explanation: formData.get('explanation'),
          feedback_correct: formData.get('feedback_correct'),
          feedback_incorrect: formData.get('feedback_incorrect'),
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-questions', quizId] });
      onComplete();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create question. Please try again.",
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
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {isEditing ? "Edit" : "Add"} Question
        </h3>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </div>

      <Textarea
        name="question"
        placeholder="Question"
        defaultValue={defaultValues?.question}
        required
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Options</label>
        {options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input
              name={`option_${index}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
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

      <Select name="correct_answer" defaultValue={defaultValues?.correct_answer}>
        <SelectTrigger>
          <SelectValue placeholder="Select correct answer" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option || `Option ${index + 1}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Textarea
        name="explanation"
        placeholder="Explanation"
        defaultValue={defaultValues?.explanation}
      />

      <Textarea
        name="feedback_correct"
        placeholder="Feedback for correct answer"
        defaultValue={defaultValues?.feedback_correct}
      />

      <Textarea
        name="feedback_incorrect"
        placeholder="Feedback for incorrect answer"
        defaultValue={defaultValues?.feedback_incorrect}
      />

      <Button type="submit">
        {isEditing ? "Update" : "Add"} Question
      </Button>
    </form>
  );
};