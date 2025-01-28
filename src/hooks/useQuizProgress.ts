import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useQuizProgress = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateProgress = async (userId: string, score: number, contentId: string) => {
    setIsUpdating(true);
    try {
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (progressError) throw progressError;

      const earnedPoints = Math.round((score / 100) * 10); // 10 points max per quiz
      const completedContent = progressData?.completed_content || [];

      const { error: updateError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          total_points: (progressData?.total_points || 0) + earnedPoints,
          completed_content: [...completedContent, contentId],
          last_activity: new Date().toISOString(),
        });

      if (updateError) throw updateError;

      toast({
        title: "Progress Updated",
        description: `You earned ${earnedPoints} points!`,
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateProgress, isUpdating };
};