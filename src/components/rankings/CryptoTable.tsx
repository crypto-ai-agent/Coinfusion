import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { PriceChange } from "@/components/shared/PriceChange";
import type { CoinData } from "@/utils/types/crypto";

interface CryptoTableProps {
  data: CoinData[];
}

export const CryptoTable = ({ data }: CryptoTableProps) => {
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>24h Change</TableHead>
          <TableHead className="hidden md:table-cell">Market Cap</TableHead>
          <TableHead className="hidden lg:table-cell">Volume (24h)</TableHead>
          <TableHead className="hidden xl:table-cell">Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((crypto) => (
          <TableRow key={crypto.symbol}>
            <TableCell className="font-medium">
              <Link to={`/crypto/${crypto.id}`} className="flex items-center hover:text-primary">
                <span className="mr-2">{crypto.name}</span>
                <span className="text-gray-500 text-sm">{crypto.symbol}</span>
              </Link>
            </TableCell>
            <TableCell>{formatPrice(crypto.price_usd)}</TableCell>
            <TableCell>
              <PriceChange value={crypto.percent_change_24h} />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {formatMarketCap(crypto.market_cap_usd)}
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              {formatMarketCap(crypto.volume_24h_usd)}
            </TableCell>
            <TableCell className="hidden xl:table-cell">
              {crypto.type}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};