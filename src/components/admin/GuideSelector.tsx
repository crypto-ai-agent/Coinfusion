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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const { data: guides, isLoading, error } = useQuery({
    queryKey: ['allGuides'],
    queryFn: async () => {
      console.log('Fetching all guides...');
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching guides:', error);
        toast({
          title: "Error fetching guides",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log('Fetched guides:', data);
      return data as Guide[];
    },
  });

  const handleSelect = (guideId: string) => {
    console.log('Selecting guide:', guideId);
    console.log('Current selected guides:', selectedGuides);
    
    let newSelection: string[];
    if (selectedGuides.includes(guideId)) {
      newSelection = selectedGuides.filter(id => id !== guideId);
    } else {
      if (selectedGuides.length >= 4) {
        newSelection = [...selectedGuides.slice(1), guideId];
        toast({
          title: "Maximum guides reached",
          description: "Removed oldest selection to add new guide",
        });
      } else {
        newSelection = [...selectedGuides, guideId];
      }
    }
    
    console.log('New selection:', newSelection);
    onSelect(newSelection);
  };

  if (error) {
    return (
      <div className="text-red-500">
        Error loading guides. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium mb-1">Currently Selected Guides</h4>
          <div className="flex flex-wrap gap-2">
            {selectedGuides.length === 0 ? (
              <p className="text-sm text-muted-foreground">No guides selected</p>
            ) : (
              guides?.filter(guide => selectedGuides.includes(guide.id))
                .map(guide => (
                  <Badge key={guide.id} variant="secondary">
                    {guide.title}
                  </Badge>
                ))
            )}
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Manage Guides
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Select Popular Guides</DialogTitle>
              <DialogDescription>
                Choose up to 4 guides to feature in the Popular Guides section.
                New selections will replace the oldest selected guide if the limit is reached.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] mt-4">
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  <div className="text-center py-4">Loading guides...</div>
                ) : !guides?.length ? (
                  <div className="text-center py-4">No guides available</div>
                ) : (
                  guides.map((guide) => (
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
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};