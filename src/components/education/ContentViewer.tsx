import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContentViewer } from "@/hooks/useContentViewer";
import { QuizTaking } from "@/components/quiz/QuizTaking";
import { ContentHeader } from "./content/ContentHeader";
import { ContentActions } from "./content/ContentActions";
import { Card, CardContent } from "@/components/ui/card";
import { useMarkAsCompleted } from "@/hooks/useMarkAsCompleted";
import { ReadingProgressBar } from "./content/ReadingProgressBar";

export const ContentViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  
  const { data: content, isLoading } = useContentViewer(id);
  const markAsCompletedMutation = useMarkAsCompleted();

  const handleQuizComplete = (score: number) => {
    setShowQuiz(false);
    markAsCompletedMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <p className="text-center text-gray-600">Content not found</p>
      </div>
    );
  }

  if (showQuiz && content.quizzes?.[0]) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <QuizTaking
            quizId={content.quizzes[0].id}
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <ReadingProgressBar value={readingProgress} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <ContentHeader
          title={content.title}
          description={content.description}
          difficulty={content.difficulty}
          points={content.points || 0}
          readTime={content.read_time}
          isCompleted={false}
        />

        <Card className="mt-8">
          <CardContent className="prose max-w-none pt-6">
            <p className="text-lg text-gray-600 mb-8">{content.description}</p>
            
            <div className="mt-8 space-y-6">
              {content.description}
            </div>

            <ContentActions
              isCompleted={false}
              hasQuiz={!!content.quizzes?.length}
              readingProgress={readingProgress}
              onComplete={() => markAsCompletedMutation.mutate()}
              onStartQuiz={() => setShowQuiz(true)}
              onBackToHub={() => navigate("/education")}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};