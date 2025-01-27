import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { PublishToggle } from "./PublishToggle";

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  slug: string;
  published: boolean;
  content_type: string;
  created_at: string;
  updated_at: string;
}

export interface NewsTableProps {
  articles: NewsArticle[];
  onEdit: (article: NewsArticle) => void;
  onDelete: (id: string) => Promise<void>;
}

export const NewsTable = ({ articles, onEdit, onDelete }: NewsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id}>
            <TableCell>{article.title}</TableCell>
            <TableCell>{article.category}</TableCell>
            <TableCell>
              <PublishToggle published={article.published} />
            </TableCell>
            <TableCell className="space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(article)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(article.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};