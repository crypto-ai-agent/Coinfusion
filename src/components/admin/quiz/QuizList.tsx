import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Quiz } from "@/types/content";

interface QuizListProps {
  quizzes: Quiz[];
  onSelect: (quizId: string) => void;
  onEdit: (quiz: Quiz) => void;
  onDelete: (quizId: string) => void;
}

export const QuizList = ({ quizzes, onSelect, onEdit, onDelete }: QuizListProps) => {
  return (
    <div className="grid gap-4">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{quiz.title}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(quiz)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(quiz.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            <CardDescription>{quiz.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Category: {quiz.quiz_categories?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Difficulty: {quiz.difficulty_level}
                </p>
                <p className="text-sm text-muted-foreground">
                  Points: {quiz.points}
                </p>
              </div>
              <Button onClick={() => onSelect(quiz.id)}>
                Manage Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};