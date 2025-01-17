import { ContentForm } from "@/components/admin/ContentForm";

interface NewsFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isEditing?: boolean;
  defaultValues?: {
    title: string;
    content: string;
    category: string;
    published: boolean;
  };
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