import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ContentViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCompleting, setIsCompleting] = useState(false);

  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ['educational-content', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('educational_content')
        .select(`
          *,
          quizzes (
            id,
            title,
            points
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: userProgress } = useQuery({
    queryKey: ['user-progress'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) return null;
      return data;
    },
  });

  const markAsCompletedMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const completedContent = userProgress?.completed_content || [];
      if (completedContent.includes(id!)) return;

      const { error } = await supabase
        .from('user_progress')
        .update({
          completed_content: [...completedContent, id],
          last_activity: new Date().toISOString(),
          current_streak: (userProgress?.current_streak || 0) + 1
        })
        .eq('user_id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      toast({
        title: "Progress Updated",
        description: "Content marked as completed. You can now take the quiz!",
      });
      setIsCompleting(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
      setIsCompleting(false);
    },
  });

  if (contentLoading) {
    return <div>Loading content...</div>;
  }

  if (!content) {
    return <div>Content not found</div>;
  }

  const isCompleted = userProgress?.completed_content?.includes(content.id);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start mb-4">
          <CardTitle>{content.title}</CardTitle>
          {isCompleted && (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Completed
            </Badge>
          )}
        </div>
        {content.has_quiz && content.quizzes?.[0] && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4" />
            <span>{content.quizzes[0].points} points available</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose max-w-none">
          {content.content}
        </div>
        
        <div className="flex justify-between items-center pt-6 border-t">
          {!isCompleted ? (
            <Button
              onClick={() => markAsCompletedMutation.mutate()}
              disabled={isCompleting}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Completed
            </Button>
          ) : content.has_quiz && content.quizzes?.[0] && (
            <Button
              onClick={() => navigate(`/quiz/${content.quizzes[0].id}`)}
            >
              Take Quiz
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};