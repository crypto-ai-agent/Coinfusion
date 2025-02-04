import { CoinData, CryptoDetails } from '../types/crypto';
import { retryWithBackoff } from '../helpers/retryLogic';
import { getCachedData, setCachedData } from './cacheManager';
import { supabase } from '@/integrations/supabase/client';

const invokeCryptoProxy = async (endpoint: string) => {
  const { data, error } = await supabase.functions.invoke('crypto-proxy', {
    body: { endpoint }
  });

  if (error) throw error;
  return data;
};

export const fetchCryptoDetails = async (id: string): Promise<CryptoDetails> => {
  const cacheKey = `crypto_details_${id}`;
  const cachedData = getCachedData<CryptoDetails>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  return retryWithBackoff(async () => {
    // Fetch basic cryptocurrency information
    const coinData = await invokeCryptoProxy(`cryptocurrency/info?id=${id}`);
    const tickerData = await invokeCryptoProxy(`cryptocurrency/quotes/latest?id=${id}`);
    
    const coin = coinData.data[id];
    const ticker = tickerData.data[id];

    const details: CryptoDetails = {
      id: id,
      name: coin.name,
      symbol: coin.symbol,
      logo: coin.logo,
      description: coin.description,
      price_usd: ticker.quote.USD.price,
      percent_change_24h: ticker.quote.USD.percent_change_24h,
      market_cap_usd: ticker.quote.USD.market_cap,
      volume_24h_usd: ticker.quote.USD.volume_24h,
      is_stablecoin: coin.tags?.includes('stablecoin') || false,
      type: coin.tags?.includes('stablecoin') ? 'stablecoin' : 'cryptocurrency',
      contract_address: coin.platform?.token_address || '',
      blockchain: coin.platform?.name || 'N/A',
      price_history: [], // We'll implement historical data in the next step
      circulating_supply: ticker.circulating_supply,
      max_supply: ticker.max_supply,
      total_supply: ticker.total_supply,
      high_24h: ticker.quote.USD.high_24h || ticker.quote.USD.price,
      low_24h: ticker.quote.USD.low_24h || ticker.quote.USD.price,
      rank: ticker.cmc_rank,
      market_cap_dominance: ticker.quote.USD.market_cap_dominance,
      category: coin.category || 'cryptocurrency',
      launch_date: coin.date_added,
      website: coin.urls?.website?.[0] || '#',
      twitter_handle: coin.urls?.twitter?.[0]?.replace('https://twitter.com/', ''),
      github_repo: coin.urls?.source_code?.[0] || '',
      whitepaper: coin.urls?.technical_doc?.[0] || '',
      alerts: [],
      pros: [],
      cons: [],
      investment_tips: [],
      risk_level: 'medium',
      volatility: ticker.quote.USD.percent_change_24h,
      market_sentiment: 'neutral'
    };

    setCachedData(cacheKey, details);
    return details;
  });
};

export const fetchCryptoPrices = async (): Promise<CoinData[]> => {
  const cacheKey = 'crypto_prices';
  const cachedData = getCachedData<CoinData[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  return retryWithBackoff(async () => {
    const response = await invokeCryptoProxy('cryptocurrency/listings/latest?limit=100');
    
    const coins = response.data.map((coin: any) => ({
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

    setCachedData(cacheKey, coins);
    return coins;
  });
};

// Re-export types and other utilities
export * from '../types/crypto';
export * from './cacheManager';