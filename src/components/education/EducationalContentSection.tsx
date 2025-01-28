import { BookOpen } from "lucide-react";
import { TopicCard } from "./TopicCard";
import { QuizSection } from "./QuizSection";
import { iconMap } from "./iconMap";

interface Quiz {
  id: string;
  title: string;
  description: string;
  points: number;
}

interface EducationalContent {
  id: string;
  title: string;
  content: string;
  category: string;
  has_quiz: boolean;
  quizzes: Quiz[];
}

interface EducationalContentSectionProps {
  content: EducationalContent[];
  completedContent: string[];
}

export const EducationalContentSection = ({ content, completedContent }: EducationalContentSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {content.map((item) => (
        <div key={item.id} className="space-y-4">
          <TopicCard
            id={item.id}
            title={item.title}
            description={item.content}
            icon={iconMap[item.category as keyof typeof iconMap] || BookOpen}
            link={`/education/content/${item.id}`}
            difficulty="Intermediate"
            points={item.quizzes?.[0]?.points || 0}
            isCompleted={completedContent?.includes(item.id) || false}
          />
          {item.has_quiz && item.quizzes?.[0] && (
            <QuizSection 
              contentId={item.id} 
              quizId={item.quizzes[0].id}
              onStartQuiz={() => {}}
            />
          )}
        </div>
      ))}
    </div>
  );
};