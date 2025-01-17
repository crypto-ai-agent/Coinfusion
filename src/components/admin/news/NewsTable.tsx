import { ContentTable } from "@/components/admin/ContentTable";

interface NewsTableProps {
  news: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export const NewsTable = ({ news, onEdit, onDelete }: NewsTableProps) => {
  return (
    <ContentTable 
      items={news.map(item => ({
        ...item,
        content_type: 'news'
      }))}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};