import { ContentForm } from "@/components/admin/ContentForm";
import { NewsArticle } from "@/utils/newsOperations";

interface NewsFormProps {
  onSubmit: (formData: {
    title: string;
    content: string;
    category: string;
    published: boolean;
    has_quiz?: boolean;
  }) => void;
  onClose: () => void;
  isEditing?: boolean;
  defaultValues?: Pick<NewsArticle, 'title' | 'content' | 'category' | 'published'>;
}

export const NewsForm = ({ onSubmit, onClose, isEditing, defaultValues }: NewsFormProps) => {
  return (
    <ContentForm 
      onSubmit={onSubmit}
      onClose={onClose}
      type="news"
      isEditing={isEditing}
      defaultValues={defaultValues}
    />
  );
};