import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface WatchlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coinId: string | null;
  watchlists: Array<{ id: string; name: string }>;
  onSuccess: () => void;
}

export const WatchlistDialog = ({ 
  open, 
  onOpenChange, 
  coinId, 
  watchlists,
  onSuccess 
}: WatchlistDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addToWatchlist = async (watchlistId: string) => {
    if (!coinId) return;

    setIsLoading(true);
    const { error } = await supabase
      .from("watchlist_items")
      .insert({
        watchlist_id: watchlistId,
        coin_id: coinId,
      });

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        toast({
          title: "Already in watchlist",
          description: "This cryptocurrency is already in the selected watchlist",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error adding to watchlist",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      onSuccess();
      toast({
        title: "Added to watchlist",
        description: "Cryptocurrency has been added to your watchlist",
      });
      onOpenChange(false);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Watchlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select onValueChange={addToWatchlist} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a watchlist" />
            </SelectTrigger>
            <SelectContent>
              {watchlists.map((watchlist) => (
                <SelectItem key={watchlist.id} value={watchlist.id}>
                  {watchlist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
};