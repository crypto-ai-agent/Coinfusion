interface CryptoOverviewProps {
  description: string;
  category: string;
  launch_date: string;
  market_cap_dominance: number;
  rank: number;
  blockchain: string;
}

export const CryptoOverview = ({
  description,
  category,
  launch_date,
  market_cap_dominance,
  rank,
  blockchain,
}: CryptoOverviewProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Category</p>
          <p className="font-semibold">{category}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Launch Date</p>
          <p className="font-semibold">{new Date(launch_date).toLocaleDateString()}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Market Dominance</p>
          <p className="font-semibold">{market_cap_dominance.toFixed(2)}%</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Market Rank</p>
          <p className="font-semibold">#{rank}</p>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Blockchain</p>
        <p className="font-semibold">{blockchain}</p>
      </div>
    </div>
  );
};