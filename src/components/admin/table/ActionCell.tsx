import { Button } from "@/components/ui/button";

interface ActionCellProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionCell = ({ onEdit, onDelete }: ActionCellProps) => {
  return (
    <div className="space-x-2">
      <Button variant="outline" size="sm" onClick={onEdit}>
        Edit
      </Button>
      <Button variant="outline" size="sm" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};