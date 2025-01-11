import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface TopicCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  difficulty: string;
  points: number;
  isCompleted: boolean;
}

export const TopicCard = ({
  title,
  description,
  icon: Icon,
  link,
  difficulty,
  points,
  isCompleted,
}: TopicCardProps) => {
  return (
    <Card className={`hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
      isCompleted ? 'border-green-500' : ''
    }`}>
      <CardHeader>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary">{difficulty}</Badge>
          <Badge variant="outline">{points} pts</Badge>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          to={link}
          className="text-primary hover:text-primary/80 font-medium inline-flex items-center group"
        >
          {isCompleted ? 'Review again' : 'Start learning'}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
};