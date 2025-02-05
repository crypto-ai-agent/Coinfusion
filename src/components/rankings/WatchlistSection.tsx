
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, List, ArrowUpDown } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  default_sort_by: string;
  default_sort_order: string;
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

const sortOptions = [
  { value: "market_cap", label: "Market Cap" },
  { value: "price", label: "Price" },
  { value: "volume", label: "Volume" },
  { value: "change", label: "24h Change" },
];

export const WatchlistSection = ({ allTokens }: WatchlistSectionProps) => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState<string | null>(null);
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListType, setNewListType] = useState("custom");
  const [newListDescription, setNewListDescription] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlists();

    // Set up realtime subscription
    const channel = supabase
      .channel('watchlist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'watchlist_items'
        },
        (payload) => {
          if (selectedWatchlist) {
            fetchWatchlistItems(selectedWatchlist);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      setSortBy(data[0].default_sort_by || "market_cap");
      setSortOrder(data[0].default_sort_order as "asc" | "desc" || "desc");
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
        default_sort_by: sortBy,
        default_sort_order: sortOrder,
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
    const selectedList = watchlists.find(w => w.id === watchlistId);
    if (selectedList) {
      setSortBy(selectedList.default_sort_by || "market_cap");
      setSortOrder(selectedList.default_sort_order as "asc" | "desc" || "desc");
    }
  };

  const handleSortChange = async (value: string) => {
    setSortBy(value);
    if (selectedWatchlist) {
      await supabase
        .from("watchlists")
        .update({ default_sort_by: value })
        .eq("id", selectedWatchlist);
    }
  };

  const toggleSortOrder = async () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    if (selectedWatchlist) {
      await supabase
        .from("watchlists")
        .update({ default_sort_order: newOrder })
        .eq("id", selectedWatchlist);
    }
  };

  const filteredTokens = watchlistItems.length > 0
    ? allTokens
        .filter(token => 
          watchlistItems.some(item => item.coin_id === token.id) &&
          (searchQuery 
            ? token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
            : true)
        )
        .sort((a, b) => {
          let comparison = 0;
          switch (sortBy) {
            case "market_cap":
              comparison = (b.market_cap_usd || 0) - (a.market_cap_usd || 0);
              break;
            case "price":
              comparison = (b.price_usd || 0) - (a.price_usd || 0);
              break;
            case "volume":
              comparison = (b.volume_24h_usd || 0) - (a.volume_24h_usd || 0);
              break;
            case "change":
              comparison = (b.percent_change_24h || 0) - (a.percent_change_24h || 0);
              break;
            default:
              comparison = (b.market_cap_usd || 0) - (a.market_cap_usd || 0);
          }
          return sortOrder === "asc" ? -comparison : comparison;
        })
    : [];

  const selectedWatchlistData = watchlists.find(w => w.id === selectedWatchlist);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
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

        <div className="flex gap-2">
          <Input
            placeholder="Search coins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-[200px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort by: {sortOptions.find(opt => opt.value === sortBy)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={toggleSortOrder}>
            <ArrowUpDown className="h-4 w-4" />
          </Button>
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
