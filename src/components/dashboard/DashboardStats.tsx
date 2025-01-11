import { Award, BookOpen, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  totalPoints: number;
  currentStreak: number;
  completedContent: string[];
  lastActivity: string;
}

export const DashboardStats = ({ 
  totalPoints, 
  currentStreak, 
  completedContent, 
  lastActivity 
}: DashboardStatsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          <Award className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPoints}</div>
          <p className="text-xs text-gray-500">Points earned</p>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStreak} days</div>
          <p className="text-xs text-gray-500">Keep it up!</p>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Topics</CardTitle>
          <BookOpen className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedContent.length}</div>
          <p className="text-xs text-gray-500">Topics mastered</p>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
          <Calendar className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {formatDate(lastActivity)}
          </div>
          <p className="text-xs text-gray-500">Last learning session</p>
        </CardContent>
      </Card>
    </div>
  );
};