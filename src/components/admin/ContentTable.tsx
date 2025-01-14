import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuizSelector } from "./QuizSelector";
import { QuizCreationFlow } from "./QuizCreationFlow";
import { QuizCell } from "./table/QuizCell";
import { ActionCell } from "./table/ActionCell";

interface ContentTableProps {
  items: Array<{
    id: string;
    title: string;
    category: string;
    content_type: string;
    published: boolean;
    has_quiz?: boolean;
    quiz_id?: string | null;
    quiz_title?: string;
  }>;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onAddQuiz?: (item: any) => void;
  onCreateNewQuiz?: (item: any) => void;
}

export const ContentTable = ({ 
  items, 
  onEdit, 
  onDelete, 
  onAddQuiz,
  onCreateNewQuiz 
}: ContentTableProps) => {
  const [showQuizSelector, setShowQuizSelector] = useState(false);
  const [showQuizCreation, setShowQuizCreation] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const handleQuizAction = (item: any) => {
    setSelectedContent(item);
    setShowQuizSelector(true);
  };

  const handleCreateQuiz = (item: any) => {
    setSelectedContent(item);
    setShowQuizCreation(true);
  };

  return (
    <div>
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
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.content_type}</TableCell>
              <TableCell>
                <QuizCell
                  contentType={item.content_type}
                  hasQuiz={item.has_quiz || false}
                  quizTitle={item.quiz_title}
                  onAddQuiz={() => handleQuizAction(item)}
                  onCreateQuiz={() => handleCreateQuiz(item)}
                />
              </TableCell>
              <TableCell>{item.published ? 'Published' : 'Draft'}</TableCell>
              <TableCell>
                <ActionCell
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showQuizSelector} onOpenChange={setShowQuizSelector}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Quiz</DialogTitle>
          </DialogHeader>
          <QuizSelector
            onSelect={async (quizId) => {
              if (quizId && selectedContent && onAddQuiz) {
                onAddQuiz({ ...selectedContent, quiz_id: quizId });
              }
              setShowQuizSelector(false);
            }}
            currentQuizId={selectedContent?.quiz_id}
          />
        </DialogContent>
      </Dialog>

      {showQuizCreation && selectedContent && (
        <QuizCreationFlow
          contentId={selectedContent.id}
          onComplete={(quizId) => {
            if (onAddQuiz) {
              onAddQuiz({ ...selectedContent, quiz_id: quizId });
            }
            setShowQuizCreation(false);
          }}
          onCancel={() => setShowQuizCreation(false)}
        />
      )}
    </div>
  );
};