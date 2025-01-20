import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, List } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WatchlistTable } from "./watchlist/WatchlistTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { CoinData } from "@/utils/types/crypto";

interface WatchlistSectionProps {
  allTokens: CoinData[];
}

interface Watchlist {
  id: string;
  name: string;
  description: string | null;
  list_type: string;
}

interface WatchlistItem {
  coin_id: string;
}

const predefinedCategories = [
  { value: "memecoins", label: "Meme Coins" },
  { value: "ai", label: "AI Projects" },
  { value: "l1", label: "Layer 1" },
  { value: "defi", label: "DeFi" },
  { value: "gaming", label: "Gaming" },
  { value: "custom", label: "Custom" },
];

export const WatchlistSection = ({ allTokens }: WatchlistSectionProps) => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState<string | null>(null);
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListType, setNewListType] = useState("custom");
  const [newListDescription, setNewListDescription] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlists();
  }, []);

  useEffect(() => {
    if (selectedWatchlist) {
      fetchWatchlistItems(selectedWatchlist);
    }
  }, [selectedWatchlist]);

  const fetchWatchlists = async () => {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("watchlists")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching watchlists",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setWatchlists(data);
    if (data.length > 0 && !selectedWatchlist) {
      setSelectedWatchlist(data[0].id);
    }
  };

  const fetchWatchlistItems = async (watchlistId: string) => {
    const { data, error } = await supabase
      .from("watchlist_items")
      .select("coin_id")
      .eq("watchlist_id", watchlistId);

    if (error) {
      toast({
        title: "Error fetching watchlist items",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setWatchlistItems(data);
  };

  const createWatchlist = async () => {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("watchlists")
      .insert({
        name: newListName,
        list_type: newListType,
        description: newListDescription,
        user_id: session.session.user.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating watchlist",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Watchlist created",
      description: "Your new watchlist has been created successfully.",
    });

    setIsCreatingList(false);
    setNewListName("");
    setNewListType("custom");
    setNewListDescription("");
    await fetchWatchlists();
  };

  const handleWatchlistChange = (watchlistId: string) => {
    setSelectedWatchlist(watchlistId);
  };

  const filteredTokens = watchlistItems.length > 0
    ? allTokens.filter(token => 
        watchlistItems.some(item => item.coin_id === token.id)
      )
    : [];

  const selectedWatchlistData = watchlists.find(w => w.id === selectedWatchlist);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedWatchlist || ""} onValueChange={handleWatchlistChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a list" />
            </SelectTrigger>
            <SelectContent>
              {watchlists.map((watchlist) => (
                <SelectItem key={watchlist.id} value={watchlist.id}>
                  {watchlist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedWatchlistData?.description && (
            <p className="text-sm text-gray-600">{selectedWatchlistData.description}</p>
          )}
        </div>

        <Dialog open={isCreatingList} onOpenChange={setIsCreatingList}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Create New List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Watchlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="listName">List Name</Label>
                <Input
                  id="listName"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="My Watchlist"
                />
              </div>
              <div>
                <Label htmlFor="listType">List Type</Label>
                <Select value={newListType} onValueChange={setNewListType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="listDescription">Description (Optional)</Label>
                <Input
                  id="listDescription"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Description of your watchlist"
                />
              </div>
              <Button onClick={createWatchlist} className="w-full">
                Create Watchlist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {watchlists.length === 0 ? (
        <div className="text-center py-8">
          <List className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Watchlists Created</h3>
          <p className="text-sm text-gray-500 mb-4">
            Create your first watchlist to start tracking cryptocurrencies
          </p>
          <Button onClick={() => setIsCreatingList(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First List
          </Button>
        </div>
      ) : !selectedWatchlist ? (
        <div className="text-center py-8">
          <List className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Watchlist</h3>
          <p className="text-sm text-gray-500">
            Choose a watchlist from the dropdown above to view its contents
          </p>
        </div>
      ) : watchlistItems.length === 0 ? (
        <div className="text-center py-8">
          <List className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Coins Added</h3>
          <p className="text-sm text-gray-500">
            Add coins to your watchlist to track them here
          </p>
        </div>
      ) : (
        <WatchlistTable 
          data={filteredTokens} 
          watchlistId={selectedWatchlist} 
          onUpdate={() => fetchWatchlistItems(selectedWatchlist)}
        />
      )}
    </div>
  );
};