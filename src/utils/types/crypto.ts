export interface CoinData {
  id: string;
  name: string;
  symbol: string;
  price_usd: number;
  percent_change_24h: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  is_stablecoin: boolean;
  type: string;
}

export interface PriceHistoryData {
  date: string;
  price: number;
  volume: number;
}

export interface CryptoDetails extends CoinData {
  logo: string;
  description: string;
  contract_address: string;
  blockchain: string;
  price_history: PriceHistoryData[];
  circulating_supply: number;
  max_supply: number;
  total_supply: number;
  high_24h: number;
  low_24h: number;
  rank: number;
  market_cap_dominance: number;
  category: string;
  launch_date: string;
  website: string;
  twitter_handle?: string;
  github_repo?: string;
  whitepaper?: string;
  alerts?: string[];
  pros: string[];
  cons: string[];
  investment_tips: string[];
  risk_level: 'low' | 'medium' | 'high';
  volatility: number;
  market_sentiment: 'bearish' | 'neutral' | 'bullish';
}