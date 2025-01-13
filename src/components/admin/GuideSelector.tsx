import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Guide = {
  id: string;
  title: string;
  description: string;
  category: string;
  read_time: string;
  points: number;
  difficulty: string;
};

export const GuideSelector = ({ onSelect, selectedGuides = [] }: { 
  onSelect: (guideIds: string[]) => void;
  selectedGuides?: string[];
}) => {
  const [open, setOpen] = useState(false);

  const { data: guides, isLoading } = useQuery({
    queryKey: ['guides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      return data as Guide[];
    },
  });

  const handleSelect = (guideId: string) => {
    const newSelection = selectedGuides.includes(guideId)
      ? selectedGuides.filter(id => id !== guideId)
      : [...selectedGuides, guideId];
    onSelect(newSelection);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Manage Guides
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Guides</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {isLoading ? (
            <div>Loading guides...</div>
          ) : (
            guides?.map((guide) => (
              <Button
                key={guide.id}
                variant={selectedGuides.includes(guide.id) ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-start space-y-2 w-full"
                onClick={() => handleSelect(guide.id)}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="font-medium">{guide.title}</span>
                  <div className="flex gap-2">
                    <Badge>{guide.difficulty}</Badge>
                    <Badge variant="outline">{guide.points} pts</Badge>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{guide.description}</span>
                <span className="text-sm text-muted-foreground">{guide.read_time}</span>
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};