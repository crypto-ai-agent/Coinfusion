import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  content_type: string;
};

export const CourseSelector = ({ onSelect, selectedCourses = [] }: { 
  onSelect: (contentIds: string[]) => void;
  selectedCourses?: string[];
}) => {
  const [open, setOpen] = useState(false);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('educational_content')
        .select('*')
        .eq('content_type', 'educational')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Course[];
    },
  });

  const handleSelect = (courseId: string) => {
    let newSelection: string[];
    if (selectedCourses.includes(courseId)) {
      newSelection = selectedCourses.filter(id => id !== courseId);
    } else {
      if (selectedCourses.length >= 4) {
        newSelection = [...selectedCourses.slice(1), courseId];
      } else {
        newSelection = [...selectedCourses, courseId];
      }
    }
    onSelect(newSelection);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium mb-1">Currently Selected Courses</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No courses selected</p>
            ) : (
              courses?.filter(course => selectedCourses.includes(course.id))
                .map(course => (
                  <Badge key={course.id} variant="secondary">
                    {course.title}
                  </Badge>
                ))
            )}
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Manage Courses
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Select Popular Courses</DialogTitle>
              <DialogDescription>
                Choose up to 4 educational materials to feature in the Popular Courses section.
                New selections will replace the oldest selected course if the limit is reached.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] mt-4">
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  <div className="text-center py-4">Loading courses...</div>
                ) : courses?.length === 0 ? (
                  <div className="text-center py-4">No courses available</div>
                ) : (
                  courses?.map((course) => (
                    <Button
                      key={course.id}
                      variant={selectedCourses.includes(course.id) ? "default" : "outline"}
                      className="h-auto p-4 flex flex-col items-start space-y-2 w-full"
                      onClick={() => handleSelect(course.id)}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="font-medium">{course.title}</span>
                        <Badge>{course.category}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{course.description}</span>
                    </Button>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};