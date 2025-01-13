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

type ContentCard = {
  id: string;
  title: string;
  card_type: string;
};

export const CardSelector = ({ onSelect }: { onSelect: (cardId: string) => void }) => {
  const [open, setOpen] = useState(false);

  const { data: cards, isLoading } = useQuery({
    queryKey: ['availableCards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_cards')
        .select('id, title, card_type')
        .eq('is_active', true);
      
      if (error) throw error;
      return data as ContentCard[];
    },
  });

  const handleSelect = (cardId: string) => {
    onSelect(cardId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Content Card</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {isLoading ? (
            <div>Loading available cards...</div>
          ) : (
            cards?.map((card) => (
              <Button
                key={card.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2"
                onClick={() => handleSelect(card.id)}
              >
                <span className="font-medium">{card.title}</span>
                <span className="text-sm text-muted-foreground">{card.card_type}</span>
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};