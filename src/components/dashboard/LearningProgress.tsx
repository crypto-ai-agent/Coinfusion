import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LearningProgressProps {
  completedContent: string[];
  totalTopics: number;
}

export const LearningProgress = ({ completedContent, totalTopics }: LearningProgressProps) => {
  const navigate = useNavigate();
  const calculateProgress = () => (completedContent.length / totalTopics) * 100;

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={calculateProgress()} className="mb-2" />
        <p className="text-sm text-gray-600 mb-4">
          {Math.round(calculateProgress())}% of curriculum completed
        </p>
        <Button 
          className="w-full"
          onClick={() => navigate("/education")}
        >
          Continue Learning
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};