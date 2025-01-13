import { CoinData, CryptoDetails } from '../types/crypto';
import { retryWithBackoff } from '../helpers/retryLogic';
import { getCachedData, setCachedData } from './cacheManager';
import { fetchCryptoDetailsCoinMarketCap, fetchFromCoinMarketCap } from './coinmarketcap';
import { supabase } from "@/integrations/supabase/client";

const getCMCApiKey = async () => {
  const { data: { CMC_API_KEY } } = await supabase.functions.invoke('get-secret', {
    body: { name: 'CMC_API_KEY' }
  });
  return CMC_API_KEY;
};

export const fetchCryptoDetails = async (id: string): Promise<CryptoDetails> => {
  const cacheKey = `crypto_details_${id}`;
  const cachedData = getCachedData<CryptoDetails>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  const apiKey = await getCMCApiKey();
  
  return retryWithBackoff(async () => {
    const data = await fetchCryptoDetailsCoinMarketCap(id, apiKey);
    setCachedData(cacheKey, data);
    return data;
  });
};

export const fetchCryptoPrices = async (): Promise<CoinData[]> => {
  const cacheKey = 'crypto_prices';
  const cachedData = getCachedData<CoinData[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  const apiKey = await getCMCApiKey();

  return retryWithBackoff(async () => {
    const data = await fetchFromCoinMarketCap(apiKey);
    setCachedData(cacheKey, data);
    return data;
  });
};

// Re-export types and other utilities
export * from '../types/crypto';
export * from './cacheManager';