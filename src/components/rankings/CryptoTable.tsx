import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Check, List } from "lucide-react";
import { Link } from "react-router-dom";
import { PriceChange } from "@/components/shared/PriceChange";
import { useToast } from "@/components/ui/use-toast";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { CoinData } from "@/utils/types/crypto";
import { useState, useEffect } from "react";

interface CryptoTableProps {
  data: CoinData[];
  selectedWatchlistId?: string | null;
  showWatchlistActions?: boolean;
}

interface Watchlist {
  id: string;
  name: string;
}

interface CoinWatchlist extends Watchlist {
  coin_id: string;
}

export const CryptoTable = ({ data, selectedWatchlistId: propSelectedWatchlistId, showWatchlistActions = false }: CryptoTableProps) => {
  const [coinWatchlists, setCoinWatchlists] = useState<{ [key: string]: CoinWatchlist[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [showWatchlistDialog, setShowWatchlistDialog] = useState(false);
  const [coinToAdd, setCoinToAdd] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (showWatchlistActions) {
      fetchWatchlists();
      fetchAllWatchlistItems();
    }
  }, [showWatchlistActions]);

  const fetchWatchlists = async () => {
    const { data: watchlistsData, error } = await supabase
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

    setWatchlists(watchlistsData);
  };

  const fetchAllWatchlistItems = async () => {
    const { data: items, error } = await supabase
      .from("watchlist_items")
      .select(`
        coin_id,
        watchlist:watchlists (
          id,
          name
        )
      `);

    if (error) {
      toast({
        title: "Error fetching watchlist items",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const groupedItems: { [key: string]: CoinWatchlist[] } = {};
    items.forEach((item: any) => {
      if (!groupedItems[item.coin_id]) {
        groupedItems[item.coin_id] = [];
      }
      groupedItems[item.coin_id].push({
        id: item.watchlist.id,
        name: item.watchlist.name,
        coin_id: item.coin_id,
      });
    });

    setCoinWatchlists(groupedItems);
  };

  const handleAddToWatchlist = (coinId: string) => {
    if (watchlists.length === 0) {
      toast({
        title: "No watchlists found",
        description: "Please create a watchlist first",
        variant: "destructive",
      });
      return;
    }
    setCoinToAdd(coinId);
    setShowWatchlistDialog(true);
  };

  const addToWatchlist = async (watchlistId: string) => {
    if (!coinToAdd) return;

    setIsLoading(true);
    const { error } = await supabase
      .from("watchlist_items")
      .insert({
        watchlist_id: watchlistId,
        coin_id: coinToAdd,
      });

    if (error) {
      toast({
        title: "Error adding to watchlist",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchAllWatchlistItems(); // Refresh the lists
      toast({
        title: "Added to watchlist",
        description: "Cryptocurrency has been added to your watchlist",
      });
      setShowWatchlistDialog(false);
    }
    setIsLoading(false);
    setCoinToAdd(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(marketCap);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-900 font-semibold">Name</TableHead>
            <TableHead className="text-gray-900 font-semibold">Price</TableHead>
            <TableHead className="text-gray-900 font-semibold">24h Change</TableHead>
            <TableHead className="text-gray-900 font-semibold hidden md:table-cell">Market Cap</TableHead>
            <TableHead className="text-gray-900 font-semibold hidden lg:table-cell">Volume (24h)</TableHead>
            <TableHead className="text-gray-900 font-semibold hidden xl:table-cell">Type</TableHead>
            {showWatchlistActions && (
              <TableHead className="text-gray-900 font-semibold">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((crypto) => (
            <TableRow key={crypto.symbol}>
              <TableCell className="font-medium">
                <Link to={`/crypto/${crypto.id}`} className="flex items-center hover:text-primary">
                  <span className="mr-2 text-gray-900">{crypto.name}</span>
                  <span className="text-gray-500 text-sm">{crypto.symbol}</span>
                </Link>
              </TableCell>
              <TableCell className="text-gray-900">{formatPrice(crypto.price_usd)}</TableCell>
              <TableCell>
                <PriceChange value={crypto.percent_change_24h} />
              </TableCell>
              <TableCell className="hidden md:table-cell text-gray-900">
                {formatMarketCap(crypto.market_cap_usd)}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-gray-900">
                {formatMarketCap(crypto.volume_24h_usd)}
              </TableCell>
              <TableCell className="hidden xl:table-cell text-gray-900">
                {crypto.type}
              </TableCell>
              {showWatchlistActions && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleAddToWatchlist(crypto.id)}
                      disabled={isLoading}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                    
                    {coinWatchlists[crypto.id]?.length > 0 && (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-sm text-gray-500">
                            <List className="h-4 w-4 mr-1" />
                            In {coinWatchlists[crypto.id].length} list{coinWatchlists[crypto.id].length > 1 ? 's' : ''}
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Current Lists</h4>
                            <div className="space-y-1">
                              {coinWatchlists[crypto.id].map((list) => (
                                <Link
                                  key={list.id}
                                  to={`/rankings?tab=watchlists&list=${list.id}`}
                                  className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {list.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showWatchlistDialog} onOpenChange={setShowWatchlistDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Watchlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={addToWatchlist}>
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
    </>
  );
};