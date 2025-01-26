import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  type: 'guide' | 'educational';
  isEditing?: boolean;
  defaultValues?: {
    title?: string;
    content?: string;
    category?: string;
    published?: boolean;
    has_quiz?: boolean;
  };
  showQuizOption?: boolean;
}

export const ContentForm = ({
  onSubmit,
  onClose,
  type,
  isEditing = false,
  defaultValues = {},
  showQuizOption = false,
}: ContentFormProps) => {
  const [published, setPublished] = useState(defaultValues.published || false);
  const [hasQuiz, setHasQuiz] = useState(defaultValues.has_quiz || false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={defaultValues.title}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={defaultValues.category || "basics"}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basics">Basics</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            defaultValue={defaultValues.content}
            required
            className="min-h-[200px]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            name="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor="published">Published</Label>
          <input type="hidden" name="published" value={published.toString()} />
        </div>

        {showQuizOption && (
          <div className="flex items-center space-x-2">
            <Switch
              id="has_quiz"
              name="has_quiz"
              checked={hasQuiz}
              onCheckedChange={setHasQuiz}
            />
            <Label htmlFor="has_quiz">Has Quiz</Label>
            <input type="hidden" name="has_quiz" value={hasQuiz.toString()} />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update' : 'Create'} {type === 'guide' ? 'Guide' : 'Educational Material'}
        </Button>
      </div>
    </form>
  );
};