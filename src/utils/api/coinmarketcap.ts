import { supabase } from "@/integrations/supabase/client";
import type { CoinData, CryptoDetails } from '../types/crypto';

export const fetchFromCoinMarketCap = async (): Promise<CoinData[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('crypto-proxy', {
      body: { endpoint: 'cryptocurrency/listings/latest?limit=20' }
    });

    if (error) {
      console.error('Error fetching from CoinMarketCap:', error);
      throw error;
    }

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

export const fetchCryptoDetailsCoinMarketCap = async (id: string): Promise<CryptoDetails> => {
  try {
    const { data, error } = await supabase.functions.invoke('crypto-proxy', {
      body: { endpoint: `cryptocurrency/quotes/latest?id=${id}` }
    });

    if (error) {
      console.error('Error fetching from CoinMarketCap:', error);
      throw error;
    }

    const coin = data.data[id];
    
    return {
      id: coin.id.toString(),
      name: coin.name,
      symbol: coin.symbol,
      logo: coin.logo || '',
      description: coin.description || '',
      price_usd: coin.quote.USD.price,
      percent_change_24h: coin.quote.USD.percent_change_24h,
      market_cap_usd: coin.quote.USD.market_cap,
      volume_24h_usd: coin.quote.USD.volume_24h,
      is_stablecoin: coin.tags?.includes('stablecoin') || false,
      type: coin.tags?.includes('stablecoin') ? 'stablecoin' : 'cryptocurrency',
      contract_address: coin.platform?.token_address || '',
      blockchain: coin.platform?.name || 'N/A',
      price_history: [],
      circulating_supply: coin.circulating_supply,
      max_supply: coin.max_supply,
      total_supply: coin.total_supply,
      high_24h: coin.quote.USD.high_24h || coin.quote.USD.price,
      low_24h: coin.quote.USD.low_24h || coin.quote.USD.price,
      rank: coin.cmc_rank,
      market_cap_dominance: coin.quote.USD.market_cap_dominance,
      category: coin.category || 'cryptocurrency',
      launch_date: coin.date_added,
      website: coin.urls?.website?.[0] || '#',
      twitter_handle: coin.urls?.twitter?.[0]?.replace('https://twitter.com/', ''),
      github_repo: coin.urls?.source_code?.[0] || '',
      whitepaper: coin.urls?.technical_doc?.[0] || '',
      pros: ['Decentralized', 'Limited supply'],
      cons: ['High volatility', 'Energy consumption'],
      investment_tips: ['DCA is recommended'],
      risk_level: 'medium',
      volatility: 5,
      market_sentiment: 'neutral'
    };
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    throw error;
  }
};