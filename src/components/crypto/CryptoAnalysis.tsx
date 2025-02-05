
import { CryptoPriceChart } from "./CryptoPriceChart";

interface CryptoAnalysisProps {
  name: string;
  pros: string[];
  cons: string[];
  high_24h: number;
  low_24h: number;
  price_usd: number;
  price_history: Array<{
    date: string;
    price: number;
    volume: number;
  }>;
  coin_id: string;  // Added this prop
}

export const CryptoAnalysis = ({
  name,
  pros = [],
  cons = [],
  high_24h,
  low_24h,
  price_usd,
  price_history,
  coin_id,  // Added this prop
}: CryptoAnalysisProps) => {
  const priceRange = ((high_24h - low_24h) / low_24h) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Analysis</h2>
      
      <CryptoPriceChart price_history={price_history} coin_id={coin_id} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-green-600">Pros</h3>
          <ul className="list-disc list-inside space-y-2">
            {pros.map((pro, index) => (
              <li key={index} className="text-gray-600">{pro}</li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-red-600">Cons</h3>
          <ul className="list-disc list-inside space-y-2">
            {cons.map((con, index) => (
              <li key={index} className="text-gray-600">{con}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">24h Price Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">24h High</p>
            <p className="font-semibold text-green-600">${high_24h.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">24h Low</p>
            <p className="font-semibold text-red-600">${low_24h.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Price Range</p>
            <p className="font-semibold">{priceRange.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
