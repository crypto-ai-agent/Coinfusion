import { Award, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressHeaderProps {
  totalPoints: number;
  currentStreak: number;
  completedCount: number;
  totalCount: number;
}

export const ProgressHeader = ({ totalPoints, currentStreak, completedCount, totalCount }: ProgressHeaderProps) => {
  const calculateProgress = () => (completedCount / totalCount) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <span className="font-semibold">{totalPoints} Points</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="font-semibold">{currentStreak} Day Streak</span>
        </div>
      </div>
      <Progress value={calculateProgress()} className="h-2" />
      <p className="text-sm text-gray-600 mt-2">
        {completedCount} of {totalCount} guides completed
      </p>
    </div>
  );
};