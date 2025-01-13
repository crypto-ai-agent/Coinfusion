import { supabase } from "@/integrations/supabase/client";
import type { CoinData } from '../types/crypto';

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