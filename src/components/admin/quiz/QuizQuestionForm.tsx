import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface QuizQuestionFormProps {
  quizId: string;
  onClose: () => void;
}

export const QuizQuestionForm = ({ quizId, onClose }: QuizQuestionFormProps) => {
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addQuestionMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const questionData = {
        quiz_id: quizId,
        question: formData.get('question'),
        options: options.filter(opt => opt.trim() !== ''),
        correct_answer: formData.get('correct_answer'),
        explanation: formData.get('explanation'),
        feedback_correct: formData.get('feedback_correct'),
        feedback_incorrect: formData.get('feedback_incorrect'),
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
      onClose();
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
    addQuestionMutation.mutate(formData);
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
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          name="question"
          required
          placeholder="Enter your question"
        />
      </div>

      <div className="space-y-2">
        <Label>Answer Options</Label>
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
        <Label htmlFor="correct_answer">Correct Answer</Label>
        <select
          id="correct_answer"
          name="correct_answer"
          className="w-full border rounded-md p-2"
          required
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option || `Option ${index + 1}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="explanation">Explanation</Label>
        <Textarea
          id="explanation"
          name="explanation"
          placeholder="Explain why this is the correct answer"
        />
      </div>

      <div>
        <Label htmlFor="feedback_correct">Feedback for Correct Answer</Label>
        <Textarea
          id="feedback_correct"
          name="feedback_correct"
          placeholder="Feedback when user answers correctly"
        />
      </div>

      <div>
        <Label htmlFor="feedback_incorrect">Feedback for Incorrect Answer</Label>
        <Textarea
          id="feedback_incorrect"
          name="feedback_incorrect"
          placeholder="Feedback when user answers incorrectly"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Question</Button>
      </div>
    </form>
  );
};