import { generateMockAnalysis } from './mockAnalysisData';

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

export interface CryptoDetails extends CoinData {
  logo: string;
  description: string;
  contract_address: string;
  blockchain: string;
  price_history: Array<{
    date: string;
    price: number;
    volume: number;
  }>;
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

const fetchFromCoinMarketCap = async (id: string): Promise<any> => {
  const apiKey = localStorage.getItem('CMC_API_KEY');
  if (!apiKey) {
    throw new Error('CoinMarketCap API key not found');
  }

  try {
    const url = new URL('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest');
    url.searchParams.append('id', id);
    url.searchParams.append('convert', 'USD');
    url.searchParams.append('aux', 'circulating_supply,max_supply,total_supply,cmc_rank,self_reported_market_cap,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported');

    const response = await fetch(url.toString(), {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('CoinMarketCap API request failed');
    }

    const data = await response.json();
    return data.data[id];
  } catch (error) {
    console.error('Error fetching from CoinMarketCap:', error);
    throw error;
  }
};

export const fetchCryptoPrices = async (): Promise<CoinData[]> => {
  const apiKey = localStorage.getItem('CMC_API_KEY');
  if (!apiKey) {
    throw new Error('CoinMarketCap API key not found');
  }

  try {
    const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=20', {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('CoinMarketCap API request failed');
    }

    const data = await response.json();
    
    return data.data.map((coin: any) => ({
      id: coin.id.toString(),
      name: coin.name,
      symbol: coin.symbol,
      price_usd: coin.quote.USD.price,
      percent_change_24h: coin.quote.USD.percent_change_24h,
      market_cap_usd: coin.quote.USD.market_cap,
      volume_24h_usd: coin.quote.USD.volume_24h,
      is_stablecoin: coin.tags?.includes('stablecoin') || false,
      type: coin.tags?.includes('stablecoin') ? 'stablecoin' : 'cryptocurrency'
    }));
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return [];
  }
};

export const fetchCryptoDetails = async (id: string): Promise<CryptoDetails> => {
  try {
    const cmcData = await fetchFromCoinMarketCap(id);
    
    // Fetch metadata from CoinMarketCap
    const metadataUrl = new URL('https://pro-api.coinmarketcap.com/v2/cryptocurrency/info');
    metadataUrl.searchParams.append('id', id);
    
    const metadataResponse = await fetch(metadataUrl.toString(), {
      headers: {
        'X-CMC_PRO_API_KEY': localStorage.getItem('CMC_API_KEY') || '',
        'Accept': 'application/json'
      }
    });
    
    const metadata = await metadataResponse.json();
    const coinMetadata = metadata.data[id];

    const mockAnalysis = generateMockAnalysis(
      cmcData.quote.USD.price,
      cmcData.quote.USD.percent_change_24h,
      cmcData.quote.USD.market_cap,
      cmcData.quote.USD.volume_24h,
      cmcData.name
    );

    return {
      id: cmcData.id.toString(),
      name: cmcData.name,
      symbol: cmcData.symbol,
      logo: coinMetadata.logo || '',
      description: coinMetadata.description || '',
      price_usd: cmcData.quote.USD.price,
      percent_change_24h: cmcData.quote.USD.percent_change_24h,
      market_cap_usd: cmcData.quote.USD.market_cap,
      volume_24h_usd: cmcData.quote.USD.volume_24h,
      is_stablecoin: cmcData.tags?.includes('stablecoin') || false,
      type: cmcData.tags?.includes('stablecoin') ? 'stablecoin' : 'cryptocurrency',
      contract_address: cmcData.platform?.token_address || '',
      blockchain: cmcData.platform?.name || 'N/A',
      price_history: [], // We'll need to make a separate API call for historical data
      circulating_supply: cmcData.circulating_supply,
      max_supply: cmcData.max_supply,
      total_supply: cmcData.total_supply,
      high_24h: cmcData.quote.USD.high_24h || cmcData.quote.USD.price,
      low_24h: cmcData.quote.USD.low_24h || cmcData.quote.USD.price,
      rank: cmcData.cmc_rank,
      market_cap_dominance: cmcData.quote.USD.market_cap_dominance,
      category: cmcData.category || 'cryptocurrency',
      launch_date: cmcData.date_added,
      website: coinMetadata.urls?.website?.[0] || '#',
      twitter_handle: coinMetadata.urls?.twitter?.[0]?.replace('https://twitter.com/', ''),
      github_repo: coinMetadata.urls?.source_code?.[0] || '',
      whitepaper: coinMetadata.urls?.technical_doc?.[0] || '',
      alerts: [],
      ...mockAnalysis,
    };
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    throw error;
  }
};
