import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CardSelector } from "./CardSelector";
import { CardPreview } from "./CardPreview";
import { PopularGuidesManager } from "./PopularGuidesManager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LayoutPanelTop } from "lucide-react";
import { Card } from "@/components/ui/card";

type PageLayout = {
  id: string;
  page_name: string;
  layout_order: string[];
  created_at?: string;
  updated_at?: string;
};

const AVAILABLE_PAGES = [
  { value: 'home', label: 'Homepage' },
  { value: 'education', label: 'Education' },
  { value: 'rankings', label: 'Rankings' },
  { value: 'news', label: 'News' },
  { value: 'dashboard', label: 'Dashboard' }
];

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
    if (!layouts) {
      const newLayout = {
        id: crypto.randomUUID(),
        page_name: selectedPage,
        layout_order: [cardId],
      };
      updateLayoutMutation.mutate(newLayout);
    } else {
      const newLayout = {
        ...layouts,
        layout_order: [...(layouts.layout_order || []), cardId],
      };
      updateLayoutMutation.mutate(newLayout);
    }
  };

  const handleRemoveCard = (index: number) => {
    if (!layouts) return;
    const newOrder = [...layouts.layout_order];
    newOrder.splice(index, 1);
    updateLayoutMutation.mutate({
      ...layouts,
      layout_order: newOrder,
    });
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Page Layout Manager</h2>
          <p className="text-sm text-muted-foreground">
            Manage the layout and content of different pages
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedPage}
            onValueChange={(value) => setSelectedPage(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_PAGES.map((page) => (
                <SelectItem key={page.value} value={page.value}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CardSelector onSelect={handleAddCard} />
        </div>
      </div>

      {selectedPage === 'education' && (
        <div className="space-y-8">
          <Card className="p-6 bg-slate-50">
            <div className="flex items-center gap-2 mb-4">
              <LayoutPanelTop className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Popular Content Management</h3>
            </div>
            <div className="space-y-6">
              <PopularGuidesManager />
            </div>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <LayoutPanelTop className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Page Layout</h3>
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
                  className="space-y-4"
                >
                  {layouts?.layout_order?.map((cardId: string, index: number) => (
                    <Draggable key={cardId} draggableId={cardId} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="group relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="p-4">
                            <CardPreview cardId={cardId} />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveCard(index)}
                            >
                              Remove
                            </Button>
                          </div>
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
      </Card>
    </div>
  );
};