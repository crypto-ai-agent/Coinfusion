import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceDisplayProps {
  price: number;
  change: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const PriceDisplay = ({ 
  price, 
  change, 
  size = "md",
  showIcon = true 
}: PriceDisplayProps) => {
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
  
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };

  return (
    <div className="space-y-1">
      <p className={`font-bold ${sizeClasses[size]}`}>
        ${price.toLocaleString()}
      </p>
      <div className={`flex items-center ${changeColor}`}>
        {showIcon && <ChangeIcon className="h-4 w-4 mr-1" />}
        <span>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
      </div>
    </div>
  );
};