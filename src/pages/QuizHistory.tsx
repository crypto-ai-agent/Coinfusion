
import { useEffect, useState } from 'react';
import { QuizHistory } from '@/components/quiz/QuizHistory';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

export const QuizHistoryPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const handleRetakeQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="p-6">
          <QuizHistory 
            userId={userId}
            onRetakeQuiz={handleRetakeQuiz}
          />
        </Card>
      </div>
    </div>
  );
};
