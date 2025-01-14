import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface QuizCardProps {
  title: string;
  description: string;
}

export const QuizCard = ({ title, description }: QuizCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-primary/5">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => navigate("/quiz")}>Start Quiz</Button>
      </CardContent>
    </Card>
  );
};