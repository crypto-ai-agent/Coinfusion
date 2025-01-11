import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContentFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  defaultValues?: {
    title?: string;
    content?: string;
    category?: string;
    slug?: string;
    published?: boolean;
  };
  isEditing: boolean;
};

export const ContentForm = ({ onSubmit, defaultValues, isEditing }: ContentFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <Input
        name="title"
        placeholder="Title"
        defaultValue={defaultValues?.title}
        required
      />
      <Textarea
        name="content"
        placeholder="Content"
        defaultValue={defaultValues?.content}
        required
      />
      <Input
        name="category"
        placeholder="Category"
        defaultValue={defaultValues?.category}
        required
      />
      <Input
        name="slug"
        placeholder="Slug"
        defaultValue={defaultValues?.slug}
        required
      />
      <div className="flex items-center space-x-2">
        <label>
          <input
            type="radio"
            name="published"
            value="true"
            defaultChecked={defaultValues?.published}
          /> Published
        </label>
        <label>
          <input
            type="radio"
            name="published"
            value="false"
            defaultChecked={!defaultValues?.published}
          /> Draft
        </label>
      </div>
      <Button type="submit">
        {isEditing ? "Update" : "Create"} Content
      </Button>
    </form>
  );
};