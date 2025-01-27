import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

interface Article {
  id: string;
  title: string;
  category: string;
  published: boolean;
  created_at: string;
  content: string;
  content_type: string;
  author_id: string;
  slug: string;
  updated_at: string;
}

interface NewsTableProps {
  data: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => Promise<void>;
  onTogglePublish?: (id: string, published: boolean) => Promise<void>;
}

export const NewsTable = ({ 
  data, 
  onEdit, 
  onDelete,
  onTogglePublish 
}: NewsTableProps) => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    await onDelete(id);
    setIsDeleting(null);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Published</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((article) => (
          <TableRow key={article.id}>
            <TableCell>{article.title}</TableCell>
            <TableCell>{article.category}</TableCell>
            <TableCell>
              <Switch
                checked={article.published}
                onCheckedChange={(checked) => onTogglePublish?.(article.id, checked)}
              />
            </TableCell>
            <TableCell>
              {new Date(article.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(article)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(article.id)}
                  disabled={isDeleting === article.id}
                >
                  {isDeleting === article.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};