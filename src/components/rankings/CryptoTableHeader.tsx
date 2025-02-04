import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CryptoTableHeaderProps {
  showWatchlistActions: boolean;
}

export const CryptoTableHeader = ({ showWatchlistActions }: CryptoTableHeaderProps) => {
  return (
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
  );
};