
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { PriceChange } from "@/components/shared/PriceChange";
import type { CoinData } from "@/utils/types/crypto";
import { WatchlistActions } from "./WatchlistActions";
import { formatPrice, formatMarketCap } from "@/utils/formatters";
import { useEffect } from "react";
import { useRealtimePrices } from "@/hooks/useRealtimePrices";

interface WatchlistTableProps {
  data: CoinData[];
  watchlistId: string;
  onUpdate: () => void;
}

export const WatchlistTable = ({ data, watchlistId, onUpdate }: WatchlistTableProps) => {
  const { prices: realtimePrices, isLoading: pricesLoading } = useRealtimePrices(
    data.map(coin => coin.id)
  );

  const getUpdatedPrice = (coin: CoinData) => {
    return realtimePrices[coin.id] || coin;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-900 font-semibold">Name</TableHead>
          <TableHead className="text-gray-900 font-semibold">Price</TableHead>
          <TableHead className="text-gray-900 font-semibold">24h Change</TableHead>
          <TableHead className="text-gray-900 font-semibold hidden md:table-cell">Market Cap</TableHead>
          <TableHead className="text-gray-900 font-semibold hidden lg:table-cell">Volume (24h)</TableHead>
          <TableHead className="text-gray-900 font-semibold hidden xl:table-cell">Type</TableHead>
          <TableHead className="text-gray-900 font-semibold w-[50px]"></TableHead>
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
              <TableCell>
                <WatchlistActions
                  coinId={crypto.id}
                  currentWatchlistId={watchlistId}
                  isAdded={true}
                  onUpdate={onUpdate}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
