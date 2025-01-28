import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { PublishToggle } from "./PublishToggle";
import { formatDate } from "@/lib/utils";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  slug: string;
  published: boolean;
  created_at: string;
  content_type: string;
  updated_at: string;
}

export interface NewsTableProps {
  articles: NewsArticle[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: Partial<NewsArticle>) => Promise<void>;
}

export const NewsTable = ({ articles, onEdit, onDelete, onUpdate }: NewsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id}>
            <TableCell>{article.title}</TableCell>
            <TableCell>{article.category}</TableCell>
            <TableCell>{formatDate(article.created_at)}</TableCell>
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
                size="icon"
                onClick={() => onEdit(article.id)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(article.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};