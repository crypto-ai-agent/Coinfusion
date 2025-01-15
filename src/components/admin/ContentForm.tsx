import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { QuizSelector } from "./QuizSelector";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ContentFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  type: 'guide' | 'educational';
  isEditing?: boolean;
  defaultValues?: {
    title: string;
    content: string;
    category: string;
    published: boolean;
    quiz_id?: string | null;
  };
  showQuizOption?: boolean;
}

export const ContentForm = ({
  onSubmit,
  onClose,
  type,
  isEditing,
  defaultValues,
  showQuizOption,
}: ContentFormProps) => {
  const [showQuizSelector, setShowQuizSelector] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(defaultValues?.quiz_id || null);

  const handleQuizSelect = (quizIds: string[]) => {
    setSelectedQuizId(quizIds[0] || null);
    setShowQuizSelector(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('quiz_id', selectedQuizId || '');
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={defaultValues?.content}
          required
          className="min-h-[200px]"
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          defaultValue={defaultValues?.category}
          required
        />
      </div>

      {showQuizOption && type === 'educational' && (
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Attach Quiz</Label>
            <p className="text-sm text-gray-500">
              {selectedQuizId ? 'Quiz attached' : 'No quiz attached'}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowQuizSelector(true)}
          >
            {selectedQuizId ? 'Change Quiz' : 'Select Quiz'}
          </Button>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          name="published"
          defaultChecked={defaultValues?.published}
        />
        <Label htmlFor="published">Published</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update' : 'Create'} {type === 'guide' ? 'Guide' : 'Content'}
        </Button>
      </div>

      <Dialog open={showQuizSelector} onOpenChange={setShowQuizSelector}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Quiz</DialogTitle>
          </DialogHeader>
          <QuizSelector
            onSelect={handleQuizSelect}
            selectedQuizzes={selectedQuizId ? [selectedQuizId] : []}
            singleSelect={true}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};