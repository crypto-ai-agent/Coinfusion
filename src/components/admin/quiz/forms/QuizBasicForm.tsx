import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface QuizBasicFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  categories: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

export const QuizBasicForm = ({ onSubmit, onCancel, categories }: QuizBasicFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Quiz Title</Label>
        <Input
          id="title"
          name="title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
        />
      </div>

      <div>
        <Label htmlFor="category_id">Category</Label>
        <select
          id="category_id"
          name="category_id"
          className="w-full border rounded-md p-2"
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="points">Points</Label>
        <Input
          id="points"
          name="points"
          type="number"
          min="0"
          defaultValue="10"
          required
        />
      </div>

      <div>
        <Label htmlFor="difficulty_level">Difficulty Level</Label>
        <select
          id="difficulty_level"
          name="difficulty_level"
          className="w-full border rounded-md p-2"
          required
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Quiz
        </Button>
      </div>
    </form>
  );
};