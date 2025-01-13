import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CardSelector } from "./CardSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

type PageLayout = {
  id: string;
  page_name: string;
  layout_order: string[];
  created_at?: string;
  updated_at?: string;
};

export const PageLayoutManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState("education");

  const { data: layouts, isLoading, error } = useQuery({
    queryKey: ['pageLayouts', selectedPage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_layouts')
        .select('*')
        .eq('page_name', selectedPage)
        .maybeSingle();

      if (error) throw error;
      return data as PageLayout;
    },
  });

  const updateLayoutMutation = useMutation({
    mutationFn: async (newLayout: PageLayout) => {
      const { error } = await supabase
        .from('page_layouts')
        .upsert({
          id: newLayout.id,
          page_name: newLayout.page_name,
          layout_order: newLayout.layout_order,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pageLayouts'] });
      toast({
        title: "Success",
        description: "Layout updated successfully.",
      });
    },
    onError: (error: Error) => {
      console.error("Update layout error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update layout.",
        variant: "destructive",
      });
    },
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination || !layouts) return;

    const items = Array.from(layouts.layout_order);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateLayoutMutation.mutate({
      ...layouts,
      layout_order: items,
    });
  };

  const handleAddCard = (cardId: string) => {
    if (!layouts) return;

    const newLayout = {
      ...layouts,
      layout_order: [...(layouts.layout_order || []), cardId],
    };

    updateLayoutMutation.mutate(newLayout);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading page layouts: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Page Layout Manager</h2>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedPage}
            onValueChange={(value) => setSelectedPage(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="dashboard">Dashboard</SelectItem>
              <SelectItem value="news">News</SelectItem>
            </SelectContent>
          </Select>
          <CardSelector onSelect={handleAddCard} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="layout">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 min-h-[200px]"
              >
                {layouts?.layout_order?.map((cardId: string, index: number) => (
                  <Draggable key={cardId} draggableId={cardId} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-4 bg-white rounded shadow hover:shadow-md transition-shadow"
                      >
                        {cardId}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {(!layouts?.layout_order || layouts.layout_order.length === 0) && !isLoading && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          No layout items added yet. Add content cards to arrange them here.
        </div>
      )}
    </div>
  );
};