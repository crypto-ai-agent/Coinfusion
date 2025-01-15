import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { BookOpen, Award } from "lucide-react";

interface EducationalContent {
  id: string;
  title: string;
  content: string;
  description: string;
  category: string;
  has_quiz: boolean;
  quizzes: {
    id: string;
    title: string;
    points: number;
  }[];
}

export const EducationalContentList = () => {
  const navigate = useNavigate();
  
  const { data: content, isLoading } = useQuery({
    queryKey: ['educational-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('educational_content')
        .select(`
          *,
          quizzes (
            id,
            title,
            points
          )
        `)
        .eq('published', true)
        .eq('content_type', 'educational')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data as any[]).map(item => ({
        ...item,
        description: item.content.substring(0, 150) + '...' // Create description from content
      })) as EducationalContent[];
    },
  });

  const { data: userProgress } = useQuery({
    queryKey: ['user-progress'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) return null;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading educational content...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content?.map((item) => (
        <Card key={item.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <Badge variant="outline">{item.category}</Badge>
              {userProgress?.completed_content?.includes(item.id) && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Completed
                </Badge>
              )}
            </div>
            <CardTitle className="mt-2">{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {item.has_quiz && item.quizzes?.[0] && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                <span>{item.quizzes[0].points} points available</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/education/content/${item.id}`)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Start Learning
            </Button>
            {item.has_quiz && item.quizzes?.[0] && (
              <Button
                variant="default"
                onClick={() => navigate(`/quiz/${item.quizzes[0].id}`)}
                disabled={!userProgress?.completed_content?.includes(item.id)}
              >
                Take Quiz
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};