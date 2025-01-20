import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, MoreHorizontal, Trash, ArrowRightLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

interface Watchlist {
  id: string;
  name: string;
}

interface WatchlistActionsProps {
  coinId: string;
  currentWatchlistId: string;
  isAdded: boolean;
  onUpdate: () => void;
}

export const WatchlistActions = ({ 
  coinId, 
  currentWatchlistId, 
  isAdded,
  onUpdate 
}: WatchlistActionsProps) => {
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchWatchlists = async () => {
    const { data, error } = await supabase
      .from("watchlists")
      .select("id, name")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching watchlists",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setWatchlists(data || []);
  };

  const handleRemove = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from("watchlist_items")
      .delete()
      .eq("watchlist_id", currentWatchlistId)
      .eq("coin_id", coinId);

    if (error) {
      toast({
        title: "Error removing from watchlist",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Removed from watchlist",
        description: "Cryptocurrency has been removed from your watchlist",
      });
      onUpdate();
    }
    setIsLoading(false);
  };

  const handleMove = async (newWatchlistId: string) => {
    setIsLoading(true);
    // First remove from current watchlist
    const { error: deleteError } = await supabase
      .from("watchlist_items")
      .delete()
      .eq("watchlist_id", currentWatchlistId)
      .eq("coin_id", coinId);

    if (deleteError) {
      toast({
        title: "Error moving cryptocurrency",
        description: deleteError.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Then add to new watchlist
    const { error: insertError } = await supabase
      .from("watchlist_items")
      .insert({
        watchlist_id: newWatchlistId,
        coin_id: coinId,
      });

    if (insertError) {
      toast({
        title: "Error moving cryptocurrency",
        description: insertError.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Moved to new watchlist",
        description: "Cryptocurrency has been moved to the selected watchlist",
      });
      onUpdate();
    }
    setIsLoading(false);
    setShowMoveDialog(false);
  };

  const handleOpenMove = () => {
    fetchWatchlists();
    setShowMoveDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleRemove} className="text-red-600">
            <Trash className="h-4 w-4 mr-2" />
            Remove
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenMove}>
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Move to List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Watchlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={handleMove}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a watchlist" />
              </SelectTrigger>
              <SelectContent>
                {watchlists
                  .filter(w => w.id !== currentWatchlistId)
                  .map((watchlist) => (
                    <SelectItem key={watchlist.id} value={watchlist.id}>
                      {watchlist.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};