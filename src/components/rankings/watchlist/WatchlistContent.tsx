import { List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WatchlistTable } from "./WatchlistTable";
import type { CoinData } from "@/utils/types/crypto";

interface WatchlistContentProps {
  watchlists: any[];
  selectedWatchlist: string | null;
  watchlistItems: any[];
  filteredTokens: CoinData[];
  onUpdate: () => void;
  onCreateList: () => void;
}

export const WatchlistContent = ({
  watchlists,
  selectedWatchlist,
  watchlistItems,
  filteredTokens,
  onUpdate,
  onCreateList,
}: WatchlistContentProps) => {
  if (watchlists.length === 0) {
    return (
      <div className="text-center py-8">
        <List className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Watchlists Created</h3>
        <p className="text-sm text-gray-500 mb-4">
          Create your first watchlist to start tracking cryptocurrencies
        </p>
        <Button onClick={onCreateList}>
          <Plus className="h-4 w-4 mr-2" />
          Create Your First List
        </Button>
      </div>
    );
  }

  if (!selectedWatchlist) {
    return (
      <div className="text-center py-8">
        <List className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Watchlist</h3>
        <p className="text-sm text-gray-500">
          Choose a watchlist from the dropdown above to view its contents
        </p>
      </div>
    );
  }

  if (watchlistItems.length === 0) {
    return (
      <div className="text-center py-8">
        <List className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Coins Added</h3>
        <p className="text-sm text-gray-500">
          Add coins to your watchlist to track them here
        </p>
      </div>
    );
  }

  return (
    <WatchlistTable 
      data={filteredTokens} 
      watchlistId={selectedWatchlist} 
      onUpdate={onUpdate}
    />
  );
};
