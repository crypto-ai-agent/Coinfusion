import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CourseSelector } from "./CourseSelector";

export const PopularCoursesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const { data: popularCourses } = useQuery({
    queryKey: ['popularCourses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('popular_course_selections')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      setSelectedCourses(data?.content_ids || []);
      return data;
    },
  });

  const updatePopularCoursesMutation = useMutation({
    mutationFn: async (contentIds: string[]) => {
      const { error } = await supabase
        .from('popular_course_selections')
        .upsert({
          id: popularCourses?.id,
          content_ids: contentIds,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
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
    setSelectedCourses(contentIds);
    updatePopularCoursesMutation.mutate(contentIds);
  };

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