
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { CoinData } from "@/utils/types/crypto";
import { WatchlistHeader } from "./watchlist/WatchlistHeader";
import { WatchlistControls } from "./watchlist/WatchlistControls";
import { WatchlistContent } from "./watchlist/WatchlistContent";

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

export const WatchlistSection = ({ allTokens }: WatchlistSectionProps) => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState<string | null>(null);
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlists();

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

  const handleSortOrderToggle = async () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    if (selectedWatchlist) {
      await supabase
        .from("watchlists")
        .update({ default_sort_order: newOrder })
        .eq("id", selectedWatchlist);
    }
  };

  const createWatchlist = async (name: string, type: string, description: string) => {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("watchlists")
      .insert({
        name,
        list_type: type,
        description,
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

    await fetchWatchlists();
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
        <WatchlistHeader
          watchlists={watchlists}
          selectedWatchlist={selectedWatchlist}
          onWatchlistChange={handleWatchlistChange}
          selectedWatchlistData={selectedWatchlistData}
        />
        <WatchlistControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          sortOrder={sortOrder}
          onSortOrderToggle={handleSortOrderToggle}
          onCreateWatchlist={createWatchlist}
        />
      </div>

      <WatchlistContent
        watchlists={watchlists}
        selectedWatchlist={selectedWatchlist}
        watchlistItems={watchlistItems}
        filteredTokens={filteredTokens}
        onUpdate={() => selectedWatchlist && fetchWatchlistItems(selectedWatchlist)}
        onCreateList={() => setIsCreatingList(true)}
      />
    </div>
  );
};
