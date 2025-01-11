interface CryptoInvestmentTipsProps {
  name: string;
  tips: string[];
  risk_level: 'low' | 'medium' | 'high';
  volatility: number;
  market_sentiment: 'bearish' | 'neutral' | 'bullish';
}

export const CryptoInvestmentTips = ({
  name,
  tips = [],
  risk_level = 'medium',
  volatility = 0,
  market_sentiment = 'neutral',
}: CryptoInvestmentTipsProps) => {
  const getRiskColor = (level: string) => {
    switch(level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'bullish': return 'text-green-600';
      case 'bearish': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Investment Guide</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Risk Level</p>
          <p className={`font-semibold capitalize ${getRiskColor(risk_level)}`}>
            {risk_level}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Volatility</p>
          <p className="font-semibold">{volatility.toFixed(2)}%</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Market Sentiment</p>
          <p className={`font-semibold capitalize ${getSentimentColor(market_sentiment)}`}>
            {market_sentiment}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Investment Tips</h3>
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block w-6 h-6 rounded-full bg-primary text-white text-center leading-6 mr-3">
                {index + 1}
              </span>
              <span className="text-gray-600">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> These investment tips are for informational purposes only. 
          Always conduct your own research and consider consulting with a financial advisor 
          before making investment decisions.
        </p>
      </div>
    </div>
  );
};