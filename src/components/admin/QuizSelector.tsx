import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type Quiz = {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty_level: string;
  quiz_categories: {
    name: string;
  } | null;
};

export const QuizSelector = ({ onSelect, selectedQuizzes = [] }: { 
  onSelect: (quizIds: string[]) => void;
  selectedQuizzes?: string[];
}) => {
  const [open, setOpen] = useState(false);

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          id,
          title,
          description,
          points,
          difficulty_level,
          quiz_categories (
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Quiz[];
    },
  });

  const handleSelect = (quizId: string) => {
    let newSelection: string[];
    if (selectedQuizzes.includes(quizId)) {
      newSelection = selectedQuizzes.filter(id => id !== quizId);
    } else {
      if (selectedQuizzes.length >= 4) {
        newSelection = [...selectedQuizzes.slice(1), quizId];
      } else {
        newSelection = [...selectedQuizzes, quizId];
      }
    }
    onSelect(newSelection);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium mb-1">Currently Selected Quizzes</h4>
          <div className="flex flex-wrap gap-2">
            {selectedQuizzes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No quizzes selected</p>
            ) : (
              quizzes?.filter(quiz => selectedQuizzes.includes(quiz.id))
                .map(quiz => (
                  <Badge key={quiz.id} variant="secondary">
                    {quiz.title}
                  </Badge>
                ))
            )}
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Manage Quizzes
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Select Featured Quizzes</DialogTitle>
              <DialogDescription>
                Choose up to 4 quizzes to feature in the Featured Quizzes section.
                New selections will replace the oldest selected quiz if the limit is reached.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] mt-4">
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  <div className="text-center py-4">Loading quizzes...</div>
                ) : quizzes?.length === 0 ? (
                  <div className="text-center py-4">No quizzes available</div>
                ) : (
                  quizzes?.map((quiz) => (
                    <Button
                      key={quiz.id}
                      variant={selectedQuizzes.includes(quiz.id) ? "default" : "outline"}
                      className="h-auto p-4 flex flex-col items-start space-y-2 w-full"
                      onClick={() => handleSelect(quiz.id)}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="font-medium">{quiz.title}</span>
                        <div className="flex gap-2">
                          <Badge>{quiz.difficulty_level}</Badge>
                          <Badge variant="outline">{quiz.points} pts</Badge>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{quiz.description}</span>
                      {quiz.quiz_categories?.name && (
                        <Badge variant="secondary">{quiz.quiz_categories.name}</Badge>
                      )}
                    </Button>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};