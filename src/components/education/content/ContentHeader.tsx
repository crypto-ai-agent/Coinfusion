import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ContentHeaderProps {
  title: string;
  description: string;
  difficulty: string;
  points: number;
  readTime?: string;
  isCompleted: boolean;
}

export const ContentHeader = ({
  title,
  description,
  difficulty,
  points,
  readTime,
  isCompleted,
}: ContentHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/education")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Education Hub
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div>
              <CardTitle className="text-3xl font-bold text-primary">
                {title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{difficulty}</Badge>
                <Badge variant="outline">{points} points</Badge>
                {readTime && (
                  <Badge variant="outline">{readTime}</Badge>
                )}
              </div>
            </div>
            {isCompleted && (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Completed
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>
    </>
  );
};