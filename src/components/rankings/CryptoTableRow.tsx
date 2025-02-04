import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { PriceChange } from "@/components/shared/PriceChange";
import { WatchlistIndicator } from "./watchlist/WatchlistIndicator";
import { formatPrice, formatMarketCap } from "@/utils/formatters";
import type { CoinData } from "@/utils/types/crypto";
import type { CoinWatchlist } from "./CryptoTable";

interface CryptoTableRowProps {
  crypto: CoinData;
  updatedCrypto: CoinData;
  pricesLoading: boolean;
  showWatchlistActions: boolean;
  coinWatchlists: { [key: string]: CoinWatchlist[] };
  onAddToWatchlist: (coinId: string) => void;
}

export const CryptoTableRow = ({
  crypto,
  updatedCrypto,
  pricesLoading,
  showWatchlistActions,
  coinWatchlists,
  onAddToWatchlist
}: CryptoTableRowProps) => {
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
          formatPrice(updatedCrypto?.price_usd)
        )}
      </TableCell>
      <TableCell>
        <PriceChange value={updatedCrypto?.percent_change_24h} />
      </TableCell>
      <TableCell className="hidden md:table-cell text-gray-900">
        {formatMarketCap(updatedCrypto?.market_cap_usd)}
      </TableCell>
      <TableCell className="hidden lg:table-cell text-gray-900">
        {formatMarketCap(updatedCrypto?.volume_24h_usd)}
      </TableCell>
      <TableCell className="hidden xl:table-cell text-gray-900">
        {updatedCrypto?.type || 'N/A'}
      </TableCell>
      {showWatchlistActions && (
        <TableCell>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => onAddToWatchlist(crypto.id)}
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
};