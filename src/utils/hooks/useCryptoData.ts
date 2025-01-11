import { useQuery } from '@tanstack/react-query';
import { fetchCryptoDetails } from '../api';
import { CryptoDetails } from '../types/crypto';

export const useCryptoData = (cryptoId: string) => {
  return useQuery<CryptoDetails, Error>({
    queryKey: ['cryptoDetails', cryptoId],
    queryFn: () => fetchCryptoDetails(cryptoId),
    retry: 1,
    staleTime: 60000, // Consider data fresh for 1 minute
  });
};