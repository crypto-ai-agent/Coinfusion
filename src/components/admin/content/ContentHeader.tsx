import { Button } from "@/components/ui/button";

interface ContentHeaderProps {
  title: string;
  onAdd: () => void;
  isEditing: boolean;
}

export const ContentHeader = ({ title, onAdd, isEditing }: ContentHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      {!isEditing && (
        <Button onClick={onAdd}>
          Add New {title}
        </Button>
      )}
    </div>
  );
};