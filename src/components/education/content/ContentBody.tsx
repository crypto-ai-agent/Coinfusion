import { Card, CardContent } from "@/components/ui/card";
import { ContentActions } from "./ContentActions";
import { ContentHeader } from "./ContentHeader";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { useMarkAsCompleted } from "@/hooks/useMarkAsCompleted";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ContentBodyProps {
  content: {
    id: string;
    title: string;
    content: string;
    difficulty?: string;
    read_time?: string;
    quizzes?: Array<{
      id: string;
      title: string;
      points: number;
    }>;
  };
  isCompleted: boolean;
}

export const ContentBody = ({ content, isCompleted }: ContentBodyProps) => {
  const navigate = useNavigate();
  const [readingProgress, setReadingProgress] = useState(0);
  const markAsCompletedMutation = useMarkAsCompleted();

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setReadingProgress(Math.min(progress, 100));
  };

  const handleStartQuiz = () => {
    if (content.quizzes?.[0]) {
      navigate(`/quiz/${content.quizzes[0].id}`);
    }
  };

  return (
    <>
      <ReadingProgressBar value={readingProgress} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <ContentHeader
          title={content.title}
          description={content.content.substring(0, 150) + '...'}
          difficulty={content.difficulty || "intermediate"}
          points={content.quizzes?.[0]?.points || 0}
          readTime={content.read_time || "5 min"}
          isCompleted={isCompleted}
        />

        <Card className="mt-8">
          <CardContent className="prose max-w-none pt-6">
            <div 
              id="content-body" 
              className="max-h-[600px] overflow-y-auto p-4"
              onScroll={handleScroll}
            >
              <div 
                className="space-y-6" 
                dangerouslySetInnerHTML={{ __html: content.content }} 
              />
            </div>

            <ContentActions
              isCompleted={isCompleted}
              hasQuiz={!!content.quizzes?.length}
              onComplete={() => markAsCompletedMutation.mutate()}
              onStartQuiz={handleStartQuiz}
              onBackToHub={() => navigate("/education")}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};