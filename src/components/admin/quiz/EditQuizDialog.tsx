import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Quiz } from "@/types/content";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditQuizDialogProps {
  quiz: Quiz | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditQuizDialog = ({ quiz, isOpen, onClose, onSuccess }: EditQuizDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quiz) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase
      .from('quizzes')
      .update({
        title: formData.get('title'),
        description: formData.get('description'),
        points: parseInt(formData.get('points') as string),
        difficulty_level: formData.get('difficulty_level'),
      })
      .eq('id', quiz.id);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update quiz",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Quiz updated successfully",
    });
    onSuccess();
    onClose();
  };

  if (!quiz) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Quiz</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={quiz.title}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={quiz.description || ''}
            />
          </div>

          <div>
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              name="points"
              type="number"
              defaultValue={quiz.points}
              required
            />
          </div>

          <div>
            <Label htmlFor="difficulty_level">Difficulty Level</Label>
            <select
              id="difficulty_level"
              name="difficulty_level"
              className="w-full border rounded-md p-2"
              defaultValue={quiz.difficulty_level}
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Quiz"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};