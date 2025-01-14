import { BookOpen } from "lucide-react";
import { TopicCard } from "./TopicCard";
import { iconMap } from "./iconMap";

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  read_time: string;
}

interface GuideCollectionProps {
  guides: Guide[];
  completedContent: string[];
}

export const GuideCollection = ({ guides, completedContent }: GuideCollectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {guides.map((guide) => (
        <TopicCard
          key={guide.id}
          id={guide.id}
          title={guide.title}
          description={guide.description}
          icon={iconMap[guide.category as keyof typeof iconMap] || BookOpen}
          link={`/education/${guide.category.toLowerCase().replace(' ', '-')}/${guide.id}`}
          difficulty={guide.difficulty}
          points={guide.points}
          readTime={guide.read_time}
          isCompleted={completedContent?.includes(guide.id) || false}
        />
      ))}
    </div>
  );
};