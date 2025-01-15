import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuizSelector } from "./QuizSelector";

export const FeaturedQuizzesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([]);

  const { data: featuredQuizzes } = useQuery({
    queryKey: ['featuredQuizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_quiz_selections')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      setSelectedQuizzes(data?.quiz_ids || []);
      return data;
    },
  });

  const updateFeaturedQuizzesMutation = useMutation({
    mutationFn: async (quizIds: string[]) => {
      const { error } = await supabase
        .from('featured_quiz_selections')
        .upsert({
          id: featuredQuizzes?.id,
          quiz_ids: quizIds,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredQuizzes'] });
      toast({
        title: "Success",
        description: "Featured quizzes updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateQuizzes = (quizIds: string[]) => {
    setSelectedQuizzes(quizIds);
    updateFeaturedQuizzesMutation.mutate(quizIds);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Manage Featured Quizzes</h3>
      <p className="text-sm text-muted-foreground">
        Select up to 4 quizzes to display in the Featured Quizzes section.
      </p>
      <QuizSelector
        onSelect={handleUpdateQuizzes}
        selectedQuizzes={selectedQuizzes}
      />
    </div>
  );
};