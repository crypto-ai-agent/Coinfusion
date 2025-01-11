import { TrendingUp, TrendingDown } from "lucide-react";

interface CryptoHeaderProps {
  name: string;
  symbol: string;
  logo: string;
  price_usd: number;
  percent_change_24h: number;
}

export const CryptoHeader = ({ 
  name, 
  symbol, 
  logo, 
  price_usd, 
  percent_change_24h 
}: CryptoHeaderProps) => {
  const priceChangeColor = percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500';
  const PriceChangeIcon = percent_change_24h >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="flex items-center gap-4 mb-6">
      <img src={logo} alt={name} className="w-16 h-16" />
      <div>
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-gray-500">{symbol}</p>
      </div>
      <div className="ml-auto text-right">
        <p className="text-2xl font-bold">${price_usd.toFixed(2)}</p>
        <div className={`flex items-center justify-end ${priceChangeColor}`}>
          <PriceChangeIcon className="h-4 w-4 mr-1" />
          <span>{percent_change_24h >= 0 ? '+' : ''}{percent_change_24h.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};