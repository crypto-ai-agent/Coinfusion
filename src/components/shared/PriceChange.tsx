import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceChangeProps {
  value: number;
}

export const PriceChange = ({ value }: PriceChangeProps) => {
  return (
    <div className="flex items-center">
      {value >= 0 ? (
        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
      ) : (
        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
      )}
      <span
        className={value >= 0 ? "text-green-500" : "text-red-500"}
      >
        {value.toFixed(2)}%
      </span>
    </div>
  );
};