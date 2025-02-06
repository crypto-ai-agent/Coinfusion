
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CoinData } from "@/utils/types/crypto";
import { formatPrice, formatMarketCap } from "@/utils/formatters";
import { Link } from "react-router-dom";
import { PriceChange } from "@/components/shared/PriceChange";

interface VirtualizedTableProps {
  data: CoinData[];
  onScroll?: () => void;
}

export const VirtualizedTable = ({ data, onScroll }: VirtualizedTableProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentHeight, setParentHeight] = useState(0);

  useEffect(() => {
    if (parentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        setParentHeight(entries[0].contentRect.height);
      });

      resizeObserver.observe(parentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 10,
  });

  return (
    <div 
      ref={parentRef} 
      className="max-h-[600px] overflow-auto"
      onScroll={() => onScroll?.()}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-900 font-semibold">Name</TableHead>
            <TableHead className="text-gray-900 font-semibold">Price</TableHead>
            <TableHead className="text-gray-900 font-semibold">24h Change</TableHead>
            <TableHead className="text-gray-900 font-semibold hidden md:table-cell">Market Cap</TableHead>
            <TableHead className="text-gray-900 font-semibold hidden lg:table-cell">Volume (24h)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <tr style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
            <td>
              <div
                style={{
                  position: 'relative',
                  transform: `translateY(${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px)`,
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const crypto = data[virtualRow.index];
                  return (
                    <TableRow
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={rowVirtualizer.measureElement}
                    >
                      <TableCell className="font-medium">
                        <Link to={`/crypto/${crypto.id}`} className="flex items-center hover:text-primary">
                          <span className="mr-2 text-gray-900">{crypto.name}</span>
                          <span className="text-gray-500 text-sm">{crypto.symbol}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {formatPrice(crypto.price_usd)}
                      </TableCell>
                      <TableCell>
                        <PriceChange value={crypto.percent_change_24h} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-900">
                        {formatMarketCap(crypto.market_cap_usd)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-900">
                        {formatMarketCap(crypto.volume_24h_usd)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </div>
            </td>
          </tr>
        </TableBody>
      </Table>
    </div>
  );
};
