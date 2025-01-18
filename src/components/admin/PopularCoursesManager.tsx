import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CourseSelector } from "./CourseSelector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";

export const PopularCoursesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const { data: popularCourses, isLoading, error } = useQuery({
    queryKey: ['popularCourses'],
    queryFn: async () => {
      console.log('Fetching popular courses...');
      const { data, error } = await supabase
        .from('popular_course_selections')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching popular courses:', error);
        throw error;
      }
      
      console.log('Fetched popular courses:', data);
      if (data?.content_ids) {
        setSelectedCourses(data.content_ids);
      }
      return data;
    },
    retry: 3,
    retryDelay: 1000,
  });

  const updatePopularCoursesMutation = useMutation({
    mutationFn: async (contentIds: string[]) => {
      console.log('Updating popular courses with:', contentIds);
      const { error } = await supabase
        .from('popular_course_selections')
        .upsert({
          id: popularCourses?.id,
          content_ids: contentIds,
          updated_at: new Date().toISOString(),
        });
      
      if (error) {
        console.error('Error updating popular courses:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['popularCourses'] });
      toast({
        title: "Success",
        description: "Popular courses updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateCourses = (contentIds: string[]) => {
    console.log('Handling course update with:', contentIds);
    setSelectedCourses(contentIds);
    updatePopularCoursesMutation.mutate(contentIds);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading popular courses. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <ReloadIcon className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading popular courses...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Manage Popular Courses</h3>
      <p className="text-sm text-muted-foreground">
        Select up to 4 educational materials to display in the Popular Courses section.
      </p>
      <CourseSelector
        onSelect={handleUpdateCourses}
        selectedCourses={selectedCourses}
      />
    </div>
  );
};