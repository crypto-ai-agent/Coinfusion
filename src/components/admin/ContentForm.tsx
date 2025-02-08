import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ContentWorkflowManager } from './content/ContentWorkflowManager';
import { RevisionHistory } from './content/RevisionHistory';
import { Content } from "@/types/content";

interface ContentFormProps {
  onSubmit: (formData: {
    title: string;
    content: string;
    category: string;
    published: boolean;
    has_quiz?: boolean;
  }) => void;
  onClose: () => void;
  type: 'guide' | 'educational' | 'news';
  isEditing?: boolean;
  defaultValues?: Partial<Content>;
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateForm = (formData: FormData): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.length < 10) {
      newErrors.content = "Content must be at least 10 characters long";
    }

    if (!category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    if (!validateForm(formData)) {
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const contentData = {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        category: formData.get('category') as string,
        published,
        has_quiz: showQuizOption ? hasQuiz : undefined,
      };
      
      await onSubmit(contentData);
      toast({
        title: "Success",
        description: `Content ${isEditing ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={defaultValues.title}
            className={errors.title ? "border-red-500" : ""}
            required
          />
          {errors.title && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.title}</AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={defaultValues.category || "basics"}>
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basics">Basics</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.category}</AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            defaultValue={defaultValues.content}
            className={`min-h-[200px] ${errors.content ? "border-red-500" : ""}`}
            required
          />
          {errors.content && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.content}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor="published">Published</Label>
        </div>

        {showQuizOption && (
          <div className="flex items-center space-x-2">
            <Switch
              id="has_quiz"
              checked={hasQuiz}
              onCheckedChange={setHasQuiz}
            />
            <Label htmlFor="has_quiz">Has Quiz</Label>
          </div>
        )}
      </div>

      {isEditing && defaultValues.id && (
        <>
          <ContentWorkflowManager
            content={defaultValues as Content}
            onWorkflowUpdate={(updatedContent) => {
              // Handle workflow updates
              toast({
                title: "Workflow Updated",
                description: "Content workflow status has been updated.",
              });
            }}
          />
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Revision History</h3>
            <RevisionHistory content={defaultValues as Content} />
          </div>
        </>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'} {type === 'guide' ? 'Guide' : type === 'news' ? 'News Article' : 'Educational Material'}
        </Button>
      </div>
    </form>
  );
};
