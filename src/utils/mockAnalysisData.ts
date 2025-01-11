interface MockAnalysisData {
  pros: string[];
  cons: string[];
  investment_tips: string[];
  risk_level: 'low' | 'medium' | 'high';
  volatility: number;
  market_sentiment: 'bearish' | 'neutral' | 'bullish';
}

export const generateMockAnalysis = (
  price: number,
  percentChange24h: number,
  marketCap: number,
  volume24h: number,
  name: string
): MockAnalysisData => {
  // Calculate volatility based on 24h change
  const volatility = Math.abs(percentChange24h);
  
  // Determine risk level based on market cap and volatility
  let risk_level: 'low' | 'medium' | 'high' = 'medium';
  if (marketCap > 10e9 && volatility < 5) risk_level = 'low';
  else if (marketCap < 1e9 || volatility > 15) risk_level = 'high';

  // Determine market sentiment based on price changes
  let market_sentiment: 'bearish' | 'neutral' | 'bullish' = 'neutral';
  if (percentChange24h > 5) market_sentiment = 'bullish';
  else if (percentChange24h < -5) market_sentiment = 'bearish';

  return {
    pros: [
      `Strong trading volume with $${(volume24h / 1e6).toFixed(2)}M in 24h trades`,
      marketCap > 1e9 ? 'Large market capitalization indicating stability' : 'Growth potential in emerging market',
      volatility < 10 ? 'Relatively stable price movements' : 'High potential for trading opportunities',
    ],
    cons: [
      volatility > 10 ? 'High price volatility presents increased risk' : 'Limited price movement may reduce short-term opportunities',
      volume24h < marketCap / 100 ? 'Relatively low trading volume' : 'High trading volume may lead to increased volatility',
      market_sentiment === 'bearish' ? 'Currently in a downward trend' : 'May be approaching resistance levels',
    ],
    investment_tips: [
      `Consider ${risk_level} risk level when investing in ${name}`,
      `Current market sentiment is ${market_sentiment}`,
      'Diversify your portfolio to manage risk',
      volume24h > marketCap / 10 ? 'High liquidity suitable for active trading' : 'Consider longer holding periods due to lower liquidity',
      `Monitor ${name}'s correlation with major cryptocurrencies`,
    ],
    risk_level,
    volatility,
    market_sentiment,
  };
};