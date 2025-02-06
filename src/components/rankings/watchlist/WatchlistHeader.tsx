
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Watchlist } from "@/types/watchlist";

interface WatchlistHeaderProps {
  watchlists: Watchlist[];
  selectedWatchlist: string | null;
  onWatchlistChange: (watchlistId: string) => void;
  selectedWatchlistData?: Watchlist;
}

export const WatchlistHeader = ({
  watchlists,
  selectedWatchlist,
  onWatchlistChange,
  selectedWatchlistData,
}: WatchlistHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center">
      <Select value={selectedWatchlist || ""} onValueChange={onWatchlistChange}>
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
  );
};
