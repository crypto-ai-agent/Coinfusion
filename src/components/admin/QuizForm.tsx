import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type QuizFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  defaultValues?: {
    title?: string;
    description?: string;
    difficulty_level?: string;
    estimated_duration?: string;
    category_id?: string;
    points?: number;
  };
  categories: Array<{ id: string; name: string }>;
  isEditing?: boolean;
};

export const QuizForm = ({
  onSubmit,
  onClose,
  defaultValues,
  categories,
  isEditing = false,
}: QuizFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {isEditing ? "Edit" : "Create"} Quiz
        </h3>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </div>

      <Input
        name="title"
        placeholder="Quiz Title"
        defaultValue={defaultValues?.title}
        required
      />
      
      <Textarea
        name="description"
        placeholder="Quiz Description"
        defaultValue={defaultValues?.description}
      />

      <Select name="difficulty_level" defaultValue={defaultValues?.difficulty_level || "beginner"}>
        <SelectTrigger>
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="beginner">Beginner</SelectItem>
          <SelectItem value="intermediate">Intermediate</SelectItem>
          <SelectItem value="advanced">Advanced</SelectItem>
        </SelectContent>
      </Select>

      <Select name="category_id" defaultValue={defaultValues?.category_id}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        name="estimated_duration"
        type="number"
        placeholder="Estimated Duration (minutes)"
        defaultValue={defaultValues?.estimated_duration || "15"}
        required
      />

      <Input
        name="points"
        type="number"
        placeholder="Points"
        defaultValue={defaultValues?.points || "10"}
        required
      />

      <Button type="submit">
        {isEditing ? "Update" : "Create"} Quiz
      </Button>
    </form>
  );
};