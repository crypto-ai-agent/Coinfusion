import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Content = {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  slug: string;
  published: boolean;
  content_type: 'guide' | 'educational';
  has_quiz?: boolean;
};

type ContentTableProps = {
  items: Content[];
  onEdit: (item: Content) => void;
  onDelete: (id: string) => void;
  onAddQuiz?: (item: Content) => void;
};

export const ContentTable = ({ items, onEdit, onDelete, onAddQuiz }: ContentTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Quiz</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {item.content_type === 'guide' ? 'Guide' : 'Educational'}
              </Badge>
            </TableCell>
            <TableCell>
              {item.content_type === 'educational' && (
                item.has_quiz ? (
                  <Badge variant="outline">Has Quiz</Badge>
                ) : onAddQuiz && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddQuiz(item)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Quiz
                  </Button>
                )
              )}
            </TableCell>
            <TableCell>
              {item.published ? (
                <span className="text-green-600">Published</span>
              ) : (
                <span className="text-gray-600">Draft</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};