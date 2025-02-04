import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { PriceChange } from "@/components/shared/PriceChange";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WatchlistDialog } from "./watchlist/WatchlistDialog";
import { WatchlistIndicator } from "./watchlist/WatchlistIndicator";
import { useRealtimePrices } from "@/hooks/useRealtimePrices";
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

export const CryptoTable = ({ 
  data, 
  selectedWatchlistId: propSelectedWatchlistId, 
  showWatchlistActions = false 
}: CryptoTableProps) => {
  const [coinWatchlists, setCoinWatchlists] = useState<{ [key: string]: CoinWatchlist[] }>({});
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [showWatchlistDialog, setShowWatchlistDialog] = useState(false);
  const [coinToAdd, setCoinToAdd] = useState<string | null>(null);
  const { toast } = useToast();

  // Get real-time prices for all coins in the table
  const { prices: realtimePrices, isLoading: pricesLoading } = useRealtimePrices(
    data.map(coin => coin.id)
  );

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

  const getUpdatedPrice = (coin: CoinData) => {
    return realtimePrices[coin.id] || coin;
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
          {data.map((crypto) => {
            const updatedCrypto = getUpdatedPrice(crypto);
            return (
              <TableRow key={crypto.symbol}>
                <TableCell className="font-medium">
                  <Link to={`/crypto/${crypto.id}`} className="flex items-center hover:text-primary">
                    <span className="mr-2 text-gray-900">{crypto.name}</span>
                    <span className="text-gray-500 text-sm">{crypto.symbol}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-gray-900">
                  {pricesLoading ? (
                    <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                  ) : (
                    formatPrice(updatedCrypto.price_usd)
                  )}
                </TableCell>
                <TableCell>
                  <PriceChange value={updatedCrypto.percent_change_24h} />
                </TableCell>
                <TableCell className="hidden md:table-cell text-gray-900">
                  {formatMarketCap(updatedCrypto.market_cap_usd)}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-gray-900">
                  {formatMarketCap(updatedCrypto.volume_24h_usd)}
                </TableCell>
                <TableCell className="hidden xl:table-cell text-gray-900">
                  {updatedCrypto.type}
                </TableCell>
                {showWatchlistActions && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleAddToWatchlist(crypto.id)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                      
                      <WatchlistIndicator 
                        watchlists={coinWatchlists[crypto.id] || []}
                      />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <WatchlistDialog
        open={showWatchlistDialog}
        onOpenChange={setShowWatchlistDialog}
        coinId={coinToAdd}
        watchlists={watchlists}
        onSuccess={fetchAllWatchlistItems}
      />
    </>
  );
};
