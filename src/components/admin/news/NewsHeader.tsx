import { Button } from "@/components/ui/button";

interface NewsHeaderProps {
  onAdd: () => void;
  isEditing: boolean;
}

export const NewsHeader = ({ onAdd, isEditing }: NewsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">News Articles</h2>
      {!isEditing && (
        <Button onClick={onAdd}>
          Add New Article
        </Button>
      )}
    </div>
  );
};