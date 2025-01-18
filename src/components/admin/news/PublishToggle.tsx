import { Switch } from "@/components/ui/switch";
import { updateNewsArticle } from "@/utils/newsOperations";
import { useToast } from "@/hooks/use-toast";

interface PublishToggleProps {
  id: string;
  published: boolean;
  onUpdate: () => void;
}

export const PublishToggle = ({ id, published, onUpdate }: PublishToggleProps) => {
  const { toast } = useToast();

  const handleToggle = async () => {
    const success = await updateNewsArticle(id, { published: !published });
    
    if (success) {
      toast({
        title: "Success",
        description: `Article ${!published ? 'published' : 'unpublished'} successfully`,
      });
      onUpdate();
    }
  };

  return (
    <Switch
      checked={published}
      onCheckedChange={handleToggle}
      aria-label="Toggle publish status"
    />
  );
};