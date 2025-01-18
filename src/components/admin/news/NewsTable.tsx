import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PublishToggle } from "./PublishToggle";
import { format } from "date-fns";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
  created_at: string;
}

interface NewsTableProps {
  news: NewsArticle[];
  onEdit: (item: NewsArticle) => void;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export const NewsTable = ({ news, onEdit, onDelete, onUpdate }: NewsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Published</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {news.map((article) => (
          <TableRow key={article.id}>
            <TableCell>{article.title}</TableCell>
            <TableCell>{article.category}</TableCell>
            <TableCell>{format(new Date(article.created_at), 'MMM d, yyyy')}</TableCell>
            <TableCell>
              <PublishToggle
                id={article.id}
                published={article.published}
                onUpdate={onUpdate}
              />
            </TableCell>
            <TableCell className="space-x-2">
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
                onClick={() => onDelete(article.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};