import { useParams, useNavigate } from "react-router-dom";
import { ContentBody } from "./content/ContentBody";
import { LoadingState } from "./content/LoadingState";
import { ErrorState } from "./content/ErrorState";
import { QuizContent } from "./content/QuizContent";
import { useContentLoader } from "./content/ContentLoader";
import { useUserProgressTracker } from "./content/UserProgressTracker";

export type ContentType = {
  id: string;
  title: string;
  content: string;
  content_type: 'guide' | 'educational';
  category: string;
  difficulty?: string;
  read_time?: string;
  description?: string;
  has_quiz?: boolean;
  published: boolean;
  quizzes?: Array<{
    id: string;
    title: string;
    points: number;
  }>;
};

export const ContentViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: content, isLoading, error } = useContentLoader(id);
  const { data: userProgress } = useUserProgressTracker(id);

  if (isLoading) return <LoadingState />;
  if (error || !content) return <ErrorState />;

  const isCompleted = userProgress?.completed_content?.includes(content.id);
  const quizId = content.quizzes?.[0]?.id;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <ContentBody
        content={content}
        isCompleted={isCompleted}
      />
      {content.has_quiz && quizId && (
        <QuizContent
          contentId={content.id}
          quizId={quizId}
          onQuizComplete={() => navigate("/education")}
        />
      )}
    </div>
  );
};