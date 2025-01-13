import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

type PageLayout = {
  id: string;
  page_name: string;
  layout_order: string[];
};

export const PageLayoutManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState("education");

  const { data: layouts, isLoading } = useQuery({
    queryKey: ['pageLayouts', selectedPage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_layouts')
        .select('*')
        .eq('page_name', selectedPage)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateLayoutMutation = useMutation({
    mutationFn: async (newLayout: PageLayout) => {
      const { error } = await supabase
        .from('page_layouts')
        .upsert(newLayout);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pageLayouts'] });
      toast({
        title: "Success",
        description: "Layout updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update layout.",
        variant: "destructive",
      });
    },
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(layouts.layout_order);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateLayoutMutation.mutate({
      ...layouts,
      layout_order: items,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Page Layout Manager</h2>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="border rounded p-2"
        >
          <option value="education">Education</option>
          <option value="dashboard">Dashboard</option>
          <option value="news">News</option>
        </select>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="layout">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {layouts?.layout_order.map((cardId: string, index: number) => (
                <Draggable key={cardId} draggableId={cardId} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-4 bg-white rounded shadow"
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
    </div>
  );
};