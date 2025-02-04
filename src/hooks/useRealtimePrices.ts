import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRealtimePrices } from '@/utils/api';
import type { CoinData } from '@/utils/types/crypto';

export const useRealtimePrices = (coinIds: string[]) => {
  const [prices, setPrices] = useState<Record<string, CoinData>>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['realtimePrices', coinIds],
    queryFn: () => fetchRealtimePrices(coinIds),
    refetchInterval: 60000, // Refetch every minute
    enabled: coinIds.length > 0,
  });

  useEffect(() => {
    if (data) {
      setPrices(data);
    }
  }, [data]);

  return {
    prices,
    isLoading,
    error
  };
};