
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from 'date-fns';
import { Redo } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface QuizHistoryProps {
  userId: string;
  onRetakeQuiz?: (quizId: string) => void;
}

export const QuizHistory = ({ userId, onRetakeQuiz }: QuizHistoryProps) => {
  const { data: attempts, isLoading } = useQuery({
    queryKey: ['quiz-attempts', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes (
            id,
            title,
            points,
            quiz_questions (count)
          )
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!attempts?.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">You haven't taken any quizzes yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Quiz History</h2>
      {attempts.map((attempt) => (
        <Card key={attempt.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{attempt.quizzes?.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  Taken {formatDistanceToNow(new Date(attempt.completed_at), { addSuffix: true })}
                </p>
              </div>
              {onRetakeQuiz && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onRetakeQuiz(attempt.quiz_id)}
                >
                  <Redo className="h-4 w-4 mr-2" />
                  Retake
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Score</span>
                  <span className="text-sm font-medium">{attempt.score}%</span>
                </div>
                <Progress value={attempt.score} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Attempt #</span>
                  <p className="font-medium">{attempt.attempt_number}</p>
                </div>
                <div>
                  <span className="text-gray-500">Time Taken</span>
                  <p className="font-medium">{attempt.duration_minutes} minutes</p>
                </div>
                <div>
                  <span className="text-gray-500">Points Earned</span>
                  <p className="font-medium">{attempt.quizzes?.points || 0}</p>
                </div>
                {attempt.feedback && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Feedback</span>
                    <p className="font-medium">{attempt.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
