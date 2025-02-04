import { Table, TableBody } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WatchlistDialog } from "./watchlist/WatchlistDialog";
import { useRealtimePrices } from "@/hooks/useRealtimePrices";
import type { CoinData } from "@/utils/types/crypto";
import { useState, useEffect } from "react";
import { CryptoTableHeader } from "./CryptoTableHeader";
import { CryptoTableRow } from "./CryptoTableRow";

export interface Watchlist {
  id: string;
  name: string;
}

export interface CoinWatchlist extends Watchlist {
  coin_id: string;
}

interface CryptoTableProps {
  data: CoinData[];
  selectedWatchlistId?: string | null;
  showWatchlistActions?: boolean;
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
        <CryptoTableHeader showWatchlistActions={showWatchlistActions} />
        <TableBody>
          {data.map((crypto) => (
            <CryptoTableRow
              key={crypto.symbol}
              crypto={crypto}
              updatedCrypto={getUpdatedPrice(crypto)}
              pricesLoading={pricesLoading}
              showWatchlistActions={showWatchlistActions}
              coinWatchlists={coinWatchlists}
              onAddToWatchlist={handleAddToWatchlist}
            />
          ))}
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