import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface NewsFormProps {
  onSubmit: (formData: {
    title: string;
    content: string;
    category: string;
    published: boolean;
  }) => void;
  onCancel: () => void;
  defaultValues?: {
    title?: string;
    content?: string;
    category?: string;
    published?: boolean;
  };
}

export const NewsForm = ({ onSubmit, onCancel, defaultValues }: NewsFormProps) => {
  const [formData, setFormData] = useState({
    title: defaultValues?.title || "",
    content: defaultValues?.content || "",
    category: defaultValues?.category || "",
    published: defaultValues?.published || false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
        />
        <Label htmlFor="published">Published</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {defaultValues ? 'Update' : 'Create'} Article
        </Button>
      </div>
    </form>
  );
};