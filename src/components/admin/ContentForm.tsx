import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type ContentFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  defaultValues?: {
    title?: string;
    content?: string;
    category?: string;
    slug?: string;
    published?: boolean;
    has_quiz?: boolean;
  };
  isEditing?: boolean;
  type: 'guide' | 'educational';
  showQuizOption?: boolean;
};

export const ContentForm = ({ 
  onSubmit, 
  onClose,
  defaultValues, 
  isEditing = false,
  type,
  showQuizOption = false,
}: ContentFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {isEditing ? "Edit" : "Create"} {type === 'guide' ? 'Guide' : 'Educational Material'}
        </h3>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Title"
            defaultValue={defaultValues?.title}
            required
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Content"
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
            placeholder="Category"
            defaultValue={defaultValues?.category}
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            placeholder="URL-friendly slug"
            defaultValue={defaultValues?.slug}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="published">Published</Label>
          <input
            type="radio"
            id="published-true"
            name="published"
            value="true"
            defaultChecked={defaultValues?.published}
          />
          <Label htmlFor="published-true">Yes</Label>
          
          <input
            type="radio"
            id="published-false"
            name="published"
            value="false"
            defaultChecked={!defaultValues?.published}
          />
          <Label htmlFor="published-false">No</Label>
        </div>

        {showQuizOption && type === 'educational' && (
          <div className="flex items-center space-x-2">
            <Switch
              id="has-quiz"
              name="has_quiz"
              defaultChecked={defaultValues?.has_quiz}
            />
            <Label htmlFor="has-quiz">Add quiz to this material</Label>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          {isEditing ? "Update" : "Create"} {type === 'guide' ? 'Guide' : 'Material'}
        </Button>
      </div>
    </form>
  );
};