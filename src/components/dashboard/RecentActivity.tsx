import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentActivityProps {
  completedContent: string[];
}

export const RecentActivity = ({ completedContent }: RecentActivityProps) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {completedContent.slice(-3).map((content, index) => (
            <div key={index} className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-3" />
              <p className="text-sm">{content}</p>
            </div>
          ))}
          {completedContent.length === 0 && (
            <p className="text-sm text-gray-600">
              No completed topics yet. Start learning to track your progress!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};